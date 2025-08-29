import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DeleteQuizModal from "../../Components/DeleteQuizModal";
import { getQuizzesWithCounts, deleteQuiz } from "../../services/quiz.service";

export default function AdminQuizPage() {
	const navigate = useNavigate();
	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedQuiz, setSelectedQuiz] = useState(null);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getQuizzesWithCounts({ page: 1, limit: 100 });
			setQuizzes(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error("[AdminQuizPage] load error:", e);
			setError(
				e?.message ||
					e?.response?.data?.message ||
					"Gagal memuat data kuis. Pastikan sudah login (token valid)."
			);
			setQuizzes([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const openDeleteModal = (quiz) => {
		setSelectedQuiz(quiz);
		setIsDeleteOpen(true);
	};

	const handleDelete = async () => {
		if (!selectedQuiz?.id) return;
		try {
			await deleteQuiz(selectedQuiz.id);
			setIsDeleteOpen(false);
			setSelectedQuiz(null);
			load();
		} catch (e) {
			alert(e?.message || "Gagal menghapus kuis");
		}
	};

	if (loading) return <div className="p-6">Memuat…</div>;

	return (
		<>
			{error && (
				<div className="p-4 mb-4 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
					<div className="font-semibold mb-2">Error</div>
					<div className="mb-3">{error}</div>
					<button
						onClick={load}
						className="px-4 py-2 rounded bg-blue-600 text-white"
					>
						Coba lagi
					</button>
				</div>
			)}

			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Manajemen Kuis
				</h2>
				<button
					onClick={() => navigate("/admin/kuis/add")}
					className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
				>
					+ Tambah Kuis
				</button>
			</div>

			<div className="overflow-hidden rounded-xl shadow border border-gray-200">
				<table className="w-full text-left border-collapse">
					<thead className="bg-blue-100">
						<tr>
							<th className="p-3 text-sm font-semibold text-gray-700">
								No
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700">
								Judul
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700">
								Deskripsi
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700">
								Status
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700">
								Jumlah Soal
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700">
								Aksi
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{quizzes.length > 0 ? (
							quizzes.map((q, idx) => (
								<tr
									key={q.id || `${q.title}-${idx}`}
									className="hover:bg-gray-50 transition"
								>
									<td className="p-3 text-sm text-gray-600">
										{idx + 1}
									</td>
									<td className="p-3 text-sm text-gray-800 font-medium">
										{q.title || "-"}
									</td>
									<td className="p-3 text-sm text-gray-600">
										{q.description?.trim?.() || "-"}
									</td>
									<td className="p-3 text-sm">
										<span
											className={`px-2 py-1 rounded-lg text-xs font-medium ${
												q.is_public
													? "bg-emerald-100 text-emerald-700"
													: "bg-gray-200 text-gray-700"
											}`}
										>
											{q.is_public ? "Publik" : "Privat"}
										</span>
									</td>
									<td className="p-3 text-sm text-gray-600">
										{q.questions_count ?? 0}
									</td>
									<td className="p-3 text-sm">
										<div className="flex gap-2">
											<button
												onClick={() =>
													navigate(
														`/admin/kuis/edit/${q.id}`,
														{
															state: { quiz: q },
														}
													)
												}
												className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
											>
												Edit
											</button>
											<button
												onClick={() =>
													openDeleteModal(q)
												}
												className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
											>
												Hapus
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									className="p-4 text-center text-gray-500 text-sm"
									colSpan={6}
								>
									Belum ada kuis.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<DeleteQuizModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={handleDelete}
				quiz={selectedQuiz}
			/>
		</>
	);
}
