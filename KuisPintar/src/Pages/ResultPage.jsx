import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";

export default function ResultPage() {
	const { state } = useLocation();
	const navigate = useNavigate();
	const { user } = useAuth();

	const {
		category = "Kuis",
		username: stateUsername,
		score = 0,
		total = 0,
		correct = 0,
		quizId = null,
	} = state ?? {};

	const displayUsername =
		user?.username ?? user?.email ?? stateUsername ?? "Guest";

	const percent =
		total > 0
			? Math.round((correct / total) * 100)
			: Math.max(0, Math.min(100, Number(score) || 0));

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
				<div className="flex justify-center mb-4">
					<Icon
						icon="twemoji:trophy"
						className="text-6xl text-yellow-400"
					/>
				</div>

				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					Hasil Kuis
				</h2>

				<p className="text-gray-600">
					Kategori: <span className="font-semibold">{category}</span>
				</p>
				<p className="text-gray-600 mb-4">
					Username:{" "}
					<span className="font-semibold">{displayUsername}</span>
				</p>

				<h3 className="text-lg font-bold text-gray-800 mb-1">
					Skor Kamu
				</h3>
				<p className="text-5xl font-extrabold text-blue-600 mb-2">
					{score}
				</p>
				<p className="text-gray-600 mb-6">
					{correct} benar dari {total} soal
				</p>

				<div className="w-full bg-gray-200 rounded-full h-3 mb-6">
					<div
						className="h-3 rounded-full bg-blue-500"
						style={{ width: `${percent}%` }}
					/>
				</div>

				<div className="flex flex-wrap justify-center gap-3">
					<button
						onClick={() => navigate("/")}
						className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
					>
						<Icon icon="mdi:home" className="text-lg" />
						Kembali
					</button>

					<button
						onClick={() =>
							quizId
								? navigate(`/quiz/${quizId}`, {
										state: { startAt: 0 },
								  })
								: navigate("/")
						}
						className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow"
					>
						<Icon icon="mdi:refresh" className="text-lg" />
						Ulangi
					</button>

					<button
						onClick={() => navigate("/leaderboard")}
						className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg border"
					>
						<Icon icon="mdi:trophy" className="text-lg" />
						Lihat Leaderboard
					</button>
				</div>
			</div>
		</div>
	);
}
