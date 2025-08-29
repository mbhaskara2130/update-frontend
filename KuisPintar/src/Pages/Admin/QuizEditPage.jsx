// src/Pages/Admin/QuizEditPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
	getQuizById,
	getQuizQuestions,
	updateQuiz,
	updateQuestion,
	addQuestion, // NEW: untuk tambah soal
	deleteQuestion as apiDeleteQuestion,
} from "../../services/quiz.service";
import Flash from "../../Components/Flash";
import DeleteQuestionModal from "../../Components/DeleteQuestionModal";

/* Util sanitize untuk EDIT & ADD */
function sanitizeQuestion(raw) {
	const text = (raw.text || "").trim();
	const trimmed = (raw.options || []).map((o) => (o || "").trim());
	const options = trimmed.filter((o) => o.length > 0);

	const oldToNew = [];
	let k = 0;
	for (let i = 0; i < trimmed.length; i++) {
		if (trimmed[i]) {
			oldToNew[i] = k;
			k++;
		}
	}

	let correctIndex = Number(raw.correctIndex ?? 0);
	if (!text) throw new Error("Pertanyaan wajib diisi");
	if (options.length < 2) throw new Error("Minimal 2 opsi harus diisi");

	if (!trimmed[correctIndex]) correctIndex = 0;
	else correctIndex = oldToNew[correctIndex] ?? 0;

	if (
		!Number.isInteger(correctIndex) ||
		correctIndex < 0 ||
		correctIndex >= options.length
	) {
		throw new Error("Index jawaban benar tidak valid");
	}
	return { text, options, correctIndex };
}

export default function QuizEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();
	const stateQuiz = location.state?.quiz;

	const [quiz, setQuiz] = useState({
		id,
		title: stateQuiz?.title || "",
		description: stateQuiz?.description || "",
		is_public: !!stateQuiz?.is_public,
	});

	const [questions, setQuestions] = useState([]);

	// EDIT state
	const [editingId, setEditingId] = useState(null);
	const [editQ, setEditQ] = useState({
		text: "",
		options: ["", "", "", ""],
		correctIndex: 0,
	});

	// ADD state (NEW)
	const [newQ, setNewQ] = useState({
		text: "",
		options: ["", "", "", ""],
		correctIndex: 0,
	});
	const [adding, setAdding] = useState(false);

	const [loading, setLoading] = useState(true);
	const [savingQuiz, setSavingQuiz] = useState(false);
	const [savingQuestion, setSavingQuestion] = useState(false);
	const [flash, setFlash] = useState(null);

	// modal hapus
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteTargetId, setDeleteTargetId] = useState(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const [detail, qs] = await Promise.allSettled([
					getQuizById(id),
					getQuizQuestions(id),
				]);

				if (detail.status === "fulfilled" && detail.value) {
					const d = detail.value;
					setQuiz((prev) => ({
						id: d.id ?? prev.id,
						title: d.title ?? prev.title,
						description: d.description ?? prev.description,
						is_public: !!(d.is_public ?? prev.is_public),
					}));
				}

				if (qs.status === "fulfilled") {
					setQuestions(qs.value || []);
				} else {
					setFlash({
						type: "error",
						message: "Gagal memuat daftar soal",
					});
				}
			} catch (e) {
				setFlash({ type: "error", message: "Gagal memuat data kuis" });
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	const handleSaveQuiz = async () => {
		try {
			if (!quiz.title.trim())
				return setFlash({
					type: "error",
					message: "Judul wajib diisi",
				});

			setSavingQuiz(true);
			await updateQuiz(quiz.id, {
				title: quiz.title,
				description: quiz.description,
				is_public: !!quiz.is_public,
			});

			navigate("/admin/kuis", {
				state: {
					flash: {
						type: "success",
						message: "Kuis berhasil diperbarui",
					},
				},
			});
		} catch (e) {
			const msg =
				e?.response?.data?.error?.message ||
				e?.response?.data?.message ||
				`Gagal menyimpan kuis (status ${e?.response?.status || "-"})`;
			setFlash({ type: "error", message: msg });
		} finally {
			setSavingQuiz(false);
		}
	};

	const startEdit = (q) => {
		setEditingId(q.id);
		const opts = [...q.options];
		while (opts.length < 4) opts.push("");
		setEditQ({
			text: q.text,
			options: opts.slice(0, 4),
			correctIndex: Number(q.correctIndex ?? 0),
		});
	};

	const handleSaveQuestion = async () => {
		try {
			if (!editingId) return;
			setSavingQuestion(true);

			const clean = sanitizeQuestion(editQ);
			await updateQuestion(quiz.id, editingId, clean);

			setQuestions((prev) =>
				prev.map((x) => (x.id === editingId ? { ...x, ...clean } : x))
			);
			setEditingId(null);
			setFlash({ type: "success", message: "Soal diperbarui" });
		} catch (e) {
			const msg =
				e?.response?.data?.error?.message ||
				e?.response?.data?.message ||
				e.message ||
				"Gagal menyimpan soal";
			setFlash({ type: "error", message: msg });
		} finally {
			setSavingQuestion(false);
		}
	};

	// === NEW: Tambah Soal ===
	const handleAddQuestion = async () => {
		try {
			setAdding(true);
			const clean = sanitizeQuestion(newQ);
			const res = await addQuestion(quiz.id, {
				text: clean.text,
				options: clean.options,
				correctIndex: clean.correctIndex,
			});
			// res dari BE bisa {id,text,options,correct_index} → normalisasi sederhana
			const appended = {
				id: res?.id,
				text: res?.text ?? clean.text,
				options: Array.isArray(res?.options)
					? res.options
					: clean.options,
				correctIndex:
					typeof res?.correct_index === "number"
						? res.correct_index
						: clean.correctIndex,
			};
			setQuestions((prev) => [...prev, appended]);
			setNewQ({ text: "", options: ["", "", "", ""], correctIndex: 0 });
			setFlash({ type: "success", message: "Soal ditambahkan" });
		} catch (e) {
			const msg =
				e?.response?.data?.error?.message ||
				e?.response?.data?.message ||
				e.message ||
				"Gagal menambahkan soal";
			setFlash({ type: "error", message: msg });
		} finally {
			setAdding(false);
		}
	};

	// hapus (pakai modal)
	const openDeleteQuestion = (qid) => {
		setDeleteTargetId(qid);
		setDeleteOpen(true);
	};

	const confirmDeleteQuestion = async () => {
		if (!deleteTargetId) return;
		try {
			await apiDeleteQuestion(deleteTargetId);
			setQuestions((prev) => prev.filter((q) => q.id !== deleteTargetId));
			setFlash({ type: "success", message: "Soal dihapus" });
		} catch (e) {
			setFlash({
				type: "error",
				message: e?.message || "Gagal hapus soal",
			});
		} finally {
			setDeleteOpen(false);
			setDeleteTargetId(null);
		}
	};

	if (loading)
		return <div className="p-6 text-gray-600">Memuat data kuis…</div>;

	return (
		<div className="p-6 space-y-6">
			{flash && (
				<Flash
					type={flash.type}
					message={flash.message}
					onClose={() => setFlash(null)}
				/>
			)}

			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Edit Kuis</h2>
				<button
					onClick={() => navigate("/admin/kuis")}
					className="px-2 py-1 border rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
				>
					Kembali
				</button>
			</div>

			{/* FORM KUIS */}
			<div className="border rounded-lg p-4 space-y-3">
				<div className="flex gap-4">
					<input
						type="text"
						placeholder="Judul Kuis"
						value={quiz.title}
						onChange={(e) =>
							setQuiz((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
						className="flex-1 px-3 py-2 border rounded-lg"
					/>
					<label className="flex items-center gap-2 whitespace-nowrap">
						<input
							type="checkbox"
							checked={!!quiz.is_public}
							onChange={(e) =>
								setQuiz((prev) => ({
									...prev,
									is_public: e.target.checked,
								}))
							}
						/>
						Publik?
					</label>
				</div>
				<textarea
					placeholder="Deskripsi"
					value={quiz.description}
					onChange={(e) =>
						setQuiz((prev) => ({
							...prev,
							description: e.target.value,
						}))
					}
					className="w-full px-3 py-2 border rounded-lg"
					rows={3}
				/>
				<div className="text-right">
					<button
						onClick={handleSaveQuiz}
						className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60 shadow hover:bg-green-700 transition"
						disabled={savingQuiz || !quiz.title}
					>
						{savingQuiz ? "Menyimpan…" : "Simpan Perubahan"}
					</button>
				</div>
			</div>

			{/* LIST SOAL */}
			<div className="border rounded-lg p-4">
				<h3 className="font-semibold mb-3">Daftar Soal</h3>

				{questions.length === 0 && (
					<div className="text-gray-500">Belum ada soal.</div>
				)}

				<div className="space-y-4">
					{questions.map((q, idx) => (
						<div key={q.id} className="border rounded p-3">
							<div className="flex items-start justify-between">
								<div className="font-semibold">
									{idx + 1}. {q.text}
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => startEdit(q)}
										className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
									>
										Edit
									</button>
									<button
										onClick={() => openDeleteQuestion(q.id)}
										className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
									>
										Hapus
									</button>
								</div>
							</div>

							<ul className="list-disc ml-6 mt-2">
								{q.options.map((o, j) => (
									<li key={j}>
										{o}{" "}
										{Number.isFinite(q.correctIndex) &&
											Number(q.correctIndex) ===
												Number(j) && (
												<span className="text-green-600 font-medium">
													(benar)
												</span>
											)}
									</li>
								))}
							</ul>

							{editingId === q.id && (
								<div className="mt-3 border-t pt-3">
									<input
										type="text"
										placeholder="Teks pertanyaan"
										value={editQ.text}
										onChange={(e) =>
											setEditQ((prev) => ({
												...prev,
												text: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border rounded mb-2"
									/>
									{editQ.options.map((opt, i) => (
										<div
											key={i}
											className="flex items-center gap-2 mb-2"
										>
											<input
												type="radio"
												name={`correct-${q.id}`}
												checked={
													editQ.correctIndex === i
												}
												onChange={() =>
													setEditQ((prev) => ({
														...prev,
														correctIndex: i,
													}))
												}
											/>
											<input
												type="text"
												placeholder={`Opsi ${i + 1}`}
												value={opt}
												onChange={(e) => {
													const arr = [
														...editQ.options,
													];
													arr[i] = e.target.value;
													setEditQ((prev) => ({
														...prev,
														options: arr,
													}));
												}}
												className="w-full px-3 py-2 border rounded"
											/>
										</div>
									))}
									<div className="flex justify-end gap-2">
										<button
											onClick={() => setEditingId(null)}
											className="px-3 py-2 border rounded"
											disabled={savingQuestion}
										>
											Batal
										</button>
										<button
											onClick={handleSaveQuestion}
											className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-60"
											disabled={savingQuestion}
										>
											{savingQuestion
												? "Menyimpan…"
												: "Simpan Soal"}
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* ==== NEW: FORM TAMBAH SOAL ==== */}
				<div className="mt-6 border-t pt-4">
					<h4 className="font-semibold mb-2">Tambah Soal Baru</h4>
					<input
						type="text"
						placeholder="Teks pertanyaan"
						value={newQ.text}
						onChange={(e) =>
							setNewQ((p) => ({ ...p, text: e.target.value }))
						}
						className="w-full px-3 py-2 border rounded mb-3"
					/>

					{newQ.options.map((opt, i) => (
						<div key={i} className="flex items-center gap-2 mb-2">
							<input
								type="radio"
								name="new-correct"
								checked={newQ.correctIndex === i}
								onChange={() =>
									setNewQ((p) => ({ ...p, correctIndex: i }))
								}
							/>
							<input
								type="text"
								placeholder={`Opsi ${i + 1}`}
								value={opt}
								onChange={(e) => {
									const arr = [...newQ.options];
									arr[i] = e.target.value;
									setNewQ((p) => ({ ...p, options: arr }));
								}}
								className="w-full px-3 py-2 border rounded"
							/>
						</div>
					))}

					<div className="text-right">
						<button
							onClick={handleAddQuestion}
							className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
							disabled={adding}
						>
							{adding ? "Menambah…" : "Tambah Soal"}
						</button>
					</div>
				</div>
			</div>

			{/* MODAL HAPUS SOAL */}
			<DeleteQuestionModal
				isOpen={deleteOpen}
				onClose={() => {
					setDeleteOpen(false);
					setDeleteTargetId(null);
				}}
				onConfirm={confirmDeleteQuestion}
			/>
		</div>
	);
}
