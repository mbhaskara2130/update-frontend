import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createQuiz, addQuestion } from "../../services/quiz.service";
import { Icon } from "@iconify/react";

/* ----------------------------- Mini Toast UI ----------------------------- */
function Toast({ toast, onClose }) {
	if (!toast) return null;

	const color =
		toast.type === "success"
			? "bg-emerald-600"
			: toast.type === "warning"
			? "bg-amber-600"
			: "bg-rose-600";

	const iconName =
		toast.type === "success"
			? "mdi:check-circle"
			: toast.type === "warning"
			? "mdi:alert-circle"
			: "mdi:close-circle";

	return (
		<div className="fixed right-4 top-4 z-[1000] min-w-[260px]">
			<div
				className={`${color} text-white shadow-lg rounded-lg px-4 py-3 flex items-start gap-3`}
			>
				<Icon icon={iconName} className="text-2xl mt-0.5" />
				<div className="flex-1">
					<p className="font-semibold">{toast.title}</p>
					{toast.message && (
						<p className="opacity-90">{toast.message}</p>
					)}
				</div>
				<button
					onClick={onClose}
					className="opacity-80 hover:opacity-100 transition ml-2"
					aria-label="Tutup notifikasi"
				>
					<Icon icon="mdi:close" />
				</button>
			</div>
		</div>
	);
}

/* ----------------------------- Sanitizer soal ---------------------------- */
function sanitizeQuestion(raw) {
	const text = (raw.text || "").trim();
	const trimmed = (raw.options || []).map((o) => (o || "").trim());
	const options = trimmed.filter((o) => o.length > 0);

	const oldToNew = [];
	let k = 0;
	for (let i = 0; i < trimmed.length; i++) {
		if (trimmed[i].length > 0) {
			oldToNew[i] = k;
			k++;
		}
	}

	let correctIndex = Number(raw.correctIndex ?? 0);
	if (!Number.isInteger(correctIndex)) correctIndex = 0;

	if (!text) throw new Error("Pertanyaan wajib diisi");
	if (options.length < 2) throw new Error("Minimal 2 opsi harus diisi");

	if (!trimmed[correctIndex] || trimmed[correctIndex].length === 0) {
		correctIndex = 0;
	} else {
		correctIndex = oldToNew[correctIndex] ?? 0;
	}

	if (correctIndex < 0 || correctIndex >= options.length) {
		throw new Error("Index jawaban benar tidak valid");
	}

	return { text, options, correctIndex };
}

/* --------------------------------- Page --------------------------------- */
export default function QuizFormPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialData = location.state?.quiz || {
		title: "",
		description: "",
		is_public: true,
		questions: [],
	};

	const [formData, setFormData] = useState(initialData);
	const [newQuestion, setNewQuestion] = useState({
		text: "",
		options: ["", "", "", ""],
		correctIndex: 0,
	});
	const [saving, setSaving] = useState(false);

	// toast state
	const [toast, setToast] = useState(null);
	const showToast = (cfg) => {
		setToast(cfg);
		const t = setTimeout(() => setToast(null), cfg?.duration ?? 2000);
		return () => clearTimeout(t);
	};

	const handleAddQuestion = () => {
		try {
			const clean = sanitizeQuestion(newQuestion);
			setFormData((prev) => ({
				...prev,
				questions: [...prev.questions, clean],
			}));
			setNewQuestion({
				text: "",
				options: ["", "", "", ""],
				correctIndex: 0,
			});
			showToast({ type: "success", title: "Soal ditambahkan" });
		} catch (e) {
			showToast({
				type: "error",
				title: "Form pertanyaan belum valid",
				message: e.message,
				duration: 2500,
			});
		}
	};

	const handleSave = async () => {
		if (!formData.title.trim()) {
			showToast({
				type: "warning",
				title: "Judul wajib diisi",
				message: "Lengkapi judul kuis dulu ya.",
			});
			return;
		}

		try {
			setSaving(true);
			const created = await createQuiz({
				title: formData.title,
				description: formData.description,
				is_public: !!formData.is_public,
			});

			const quizId = created.id;

			for (let i = 0; i < formData.questions.length; i++) {
				const clean = sanitizeQuestion(formData.questions[i]);
				await addQuestion(quizId, {
					text: clean.text,
					options: clean.options,
					correctIndex: Number(clean.correctIndex), // service → correct_index
				});
			}

			showToast({
				type: "success",
				title: "Kuis tersimpan",
				message: "Mengalihkan ke daftar kuis…",
			});
			setTimeout(() => navigate("/admin/kuis"), 1200);
		} catch (e) {
			showToast({
				type: "error",
				title: "Gagal menyimpan kuis",
				message: e?.response?.data?.error?.message || e.message,
				duration: 3000,
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="p-6">
			<Toast toast={toast} onClose={() => setToast(null)} />

			<h2 className="text-2xl font-bold mb-6">
				{location.state?.quiz ? "Edit Kuis" : "Tambah Kuis"}
			</h2>

			{/* Judul & deskripsi */}
			<div className="mb-4 space-y-3">
				<input
					type="text"
					placeholder="Judul Kuis"
					value={formData.title}
					onChange={(e) =>
						setFormData({ ...formData, title: e.target.value })
					}
					className="w-full px-3 py-2 border rounded-lg"
					required
				/>
				<textarea
					placeholder="Deskripsi (opsional)"
					value={formData.description}
					onChange={(e) =>
						setFormData({
							...formData,
							description: e.target.value,
						})
					}
					className="w-full px-3 py-2 border rounded-lg"
					rows={3}
				/>
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={!!formData.is_public}
						onChange={(e) =>
							setFormData({
								...formData,
								is_public: e.target.checked,
							})
						}
					/>
					<span>Publik?</span>
				</label>
			</div>

			{/* Tambah Soal */}
			<div className="border p-4 rounded-lg mb-6">
				<h4 className="font-semibold mb-2">Tambah Soal</h4>
				<input
					type="text"
					placeholder="Teks pertanyaan"
					value={newQuestion.text}
					onChange={(e) =>
						setNewQuestion({ ...newQuestion, text: e.target.value })
					}
					className="w-full px-3 py-2 border rounded-lg mb-2"
				/>
				{newQuestion.options.map((opt, i) => (
					<div key={i} className="flex items-center gap-2 mb-2">
						<input
							type="radio"
							name="correct"
							checked={newQuestion.correctIndex === i}
							onChange={() =>
								setNewQuestion({
									...newQuestion,
									correctIndex: i,
								})
							}
						/>
						<input
							type="text"
							placeholder={`Opsi ${i + 1}`}
							value={opt}
							onChange={(e) => {
								const updated = [...newQuestion.options];
								updated[i] = e.target.value;
								setNewQuestion({
									...newQuestion,
									options: updated,
								});
							}}
							className="w-full px-3 py-2 border rounded-lg"
						/>
					</div>
				))}

				<button
					onClick={handleAddQuestion}
					className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
				>
					Tambah Soal
				</button>
			</div>

			{/* Preview Soal */}
			<div className="max-h-[300px] overflow-y-auto border p-4 rounded-lg mb-6">
				{formData.questions.length === 0 && (
					<p className="text-sm text-gray-500">
						Belum ada soal. Tambahkan minimal dua opsi untuk tiap
						soal ya.
					</p>
				)}
				{formData.questions.map((q, i) => (
					<div key={i} className="border-b py-2">
						<p className="font-semibold">
							{i + 1}. {q.text}
						</p>
						<ul className="list-disc ml-6">
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
					</div>
				))}
			</div>

			{/* Aksi */}
			<div className="flex justify-end gap-2">
				<button
					onClick={() => navigate("/admin/kuis")}
					className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
					disabled={saving}
				>
					Kembali
				</button>
				<button
					onClick={handleSave}
					className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
					disabled={saving || !formData.title}
				>
					{saving ? "Menyimpan..." : "Simpan"}
				</button>
			</div>
		</div>
	);
}
