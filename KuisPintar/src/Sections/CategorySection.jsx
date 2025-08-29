import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../Components/CategoryCard";
import ConfirmModal from "../Components/StartQuizModal";
import { getPublicQuizzes } from "../services/quiz.service";

export default function CategorySection() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState("");
	const [quizzes, setQuizzes] = useState([]);
	const [selectedQuiz, setSelectedQuiz] = useState(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			setErr("");
			try {
				const data = await getPublicQuizzes({ page: 1, limit: 12 });
				setQuizzes(data);
			} catch (e) {
				setErr(e.message || "Gagal memuat kuis");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleStartQuiz = () => {
		if (!selectedQuiz?.id) return;
		navigate(`/quiz/${selectedQuiz.id}`, { state: { quiz: selectedQuiz } });
		setSelectedQuiz(null);
	};

	return (
		<section
			id="kategori"
			className="bg-gradient-to-b from-blue-50 to-white rounded-t-3xl -mt-10 pt-16 pb-24 px-8 md:px-16 lg:px-32"
		>
			<h2 className="text-3xl font-bold text-center text-gray-800">
				Daftar Kuis Publik
			</h2>
			<p className="text-center text-gray-500 mt-2">
				Pilih kuis publik dan mulai belajar sekarang
			</p>

			{loading && (
				<div className="text-center mt-8 text-gray-500">Memuat…</div>
			)}
			{err && <div className="text-center mt-8 text-rose-600">{err}</div>}

			{!loading && !err && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
					{quizzes.map((q) => (
						<CategoryCard
							key={q.id}
							icon={<span className="text-3xl">📘</span>}
							title={q.title}
							description={q.description || "—"}
							onClick={() => setSelectedQuiz(q)}
						/>
					))}
					{quizzes.length === 0 && (
						<div className="col-span-full text-center text-gray-500">
							Belum ada kuis publik yang tersedia.
						</div>
					)}
				</div>
			)}

			<ConfirmModal
				category={selectedQuiz?.title}
				onConfirm={handleStartQuiz}
				onCancel={() => setSelectedQuiz(null)}
			/>
		</section>
	);
}
