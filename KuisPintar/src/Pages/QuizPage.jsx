import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ExitConfirm from "../Components/ExitModal";
import SubmitConfirm from "../Components/SubmitModal";
import {
	getQuizById,
	getQuizQuestions,
	submitQuizResult,
	createAttempt,
} from "../services/quiz.service";
import { useAuth } from "../context/AuthContext";

export default function QuizPage() {
	const { id } = useParams();
	const quizId = Number(id);
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();

	const stateQuiz = location.state?.quiz || null;

	const [quiz, setQuiz] = useState(stateQuiz);
	const [questions, setQuestions] = useState([]);
	const [selectedById, setSelectedById] = useState({});
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState("");
	const [showExitModal, setShowExitModal] = useState(false);
	const [finishConfirm, setFinishConfirm] = useState(false);
	const [attemptId, setAttemptId] = useState(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			setErr("");
			try {
				if (!stateQuiz) {
					try {
						const dq = await getQuizById(quizId);
						setQuiz(dq);
					} catch {
						setQuiz(
							(prev) =>
								prev || { id: quizId, title: `Kuis #${quizId}` }
						);
					}
				}

				const qs = await getQuizQuestions(quizId);
				setQuestions(qs || []);

				const att = await createAttempt(quizId).catch(() => null);
				setAttemptId(att?.attempt_id ?? att?.id ?? null);

				const init = {};
				(qs || []).forEach((q) => (init[q.id] = undefined));
				setSelectedById(init);
			} catch (e) {
				setErr(e?.message || "Gagal memuat kuis");
			} finally {
				setLoading(false);
			}
		})();
	}, [quizId]); // eslint-disable-line

	const startAt = Number(location.state?.startAt ?? 0);
	const [index, setIndex] = useState(0);
	const computedStart = useMemo(
		() => Math.max(0, Math.min(startAt, Math.max(questions.length - 1, 0))),
		[startAt, questions.length]
	);
	useEffect(() => setIndex(computedStart), [computedStart]);

	const handleChoose = (qId, optIdx) => {
		setSelectedById((prev) => ({ ...prev, [qId]: optIdx }));
	};

	const progress =
		questions.length > 0
			? Math.min(100, ((index + 1) / questions.length) * 100)
			: 0;

	// 🔒 username final dipakai untuk submit & result
	const resolvedUsername =
		user?.username ??
		user?.email ??
		`Guest${Math.floor(1000 + Math.random() * 9000)}`;

	const finishAndSubmit = async () => {
		let correct = 0;
		const answers = {};
		for (const q of questions) {
			const picked = selectedById[q.id];
			if (picked != null) answers[q.id] = Number(picked);
			if (Number(picked) === Number(q.correctIndex)) correct++;
		}
		const total = questions.length;
		const wrong = Math.max(total - correct, 0);
		const score = Math.round((correct / Math.max(total, 1)) * 100);

		try {
			await submitQuizResult(quizId, {
				attempt_id: attemptId,
				username: resolvedUsername,
				correct,
				wrong,
				score,
				answers, // biar BE happy (punya jawaban per nomor)
			});
		} catch {
			/* kalau submit gagal, tetap lanjut ke result */
		}

		navigate("/result", {
			state: {
				category: quiz?.title ?? "Kuis",
				username: resolvedUsername, // <-- penting
				score,
				total,
				correct,
				quizId,
				attemptId,
			},
		});
	};

	if (loading)
		return (
			<div className="min-h-screen grid place-items-center text-gray-500">
				Memuat kuis…
			</div>
		);

	if (err)
		return (
			<div className="min-h-screen grid place-items-center text-rose-600">
				{err}
			</div>
		);

	if (!quiz)
		return (
			<div className="min-h-screen grid place-items-center text-rose-600">
				Kuis tidak ditemukan.
			</div>
		);

	const q = questions[index];

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
			<div className="bg-white w-full max-w-3xl shadow-lg rounded-xl p-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-blue-600 font-bold text-xl">
						{quiz?.title ?? `Kuis #${quizId}`}
					</h2>
					<button
						onClick={() => setShowExitModal(true)}
						className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-sm"
					>
						Keluar
					</button>
				</div>

				{/* Card Soal */}
				{questions.length > 0 ? (
					<div className="border rounded-lg p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-semibold">
								Soal {index + 1}
							</h3>
							{/* Timer dihilangkan sesuai permintaan */}
						</div>

						{/* Progress bar */}
						<div className="w-full bg-gray-200 rounded-full h-2 mb-6">
							<div
								className="bg-blue-500 h-2 rounded-full"
								style={{ width: `${progress}%` }}
							/>
						</div>

						{/* Pertanyaan */}
						<p className="text-gray-800 font-medium mb-4">
							{q.text}
						</p>

						{/* Opsi */}
						<div className="space-y-3">
							{q.options.map((opt, i) => (
								<label
									key={i}
									className="flex items-center space-x-3 cursor-pointer"
								>
									<input
										type="radio"
										name={`q-${q.id}`}
										value={i}
										checked={
											Number(selectedById[q.id]) === i
										}
										onChange={() => handleChoose(q.id, i)}
										className="form-radio text-blue-500"
									/>
									<span>{opt}</span>
								</label>
							))}
						</div>

						{/* Navigasi */}
						<div className="flex justify-between items-center mt-6">
							<button
								disabled={index === 0}
								onClick={() => setIndex((x) => x - 1)}
								className={`px-4 py-2 rounded-lg ${
									index === 0
										? "bg-gray-200 text-gray-400 cursor-not-allowed"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
							>
								Back
							</button>

							{index < questions.length - 1 ? (
								<button
									onClick={() => setIndex((x) => x + 1)}
									className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
								>
									Next
								</button>
							) : (
								<button
									onClick={() => setFinishConfirm(true)}
									className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
								>
									Selesaikan Kuis
								</button>
							)}
						</div>
					</div>
				) : (
					<div className="text-gray-500">
						Belum ada soal pada kuis ini.
					</div>
				)}
			</div>

			{/* Modals */}
			<ExitConfirm
				show={showExitModal}
				onConfirm={() => navigate("/")}
				onCancel={() => setShowExitModal(false)}
			/>
			<SubmitConfirm
				show={finishConfirm}
				onConfirm={finishAndSubmit}
				onCancel={() => setFinishConfirm(false)}
			/>
		</div>
	);
}
