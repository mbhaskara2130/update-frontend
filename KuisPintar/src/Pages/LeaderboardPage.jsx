import React, { useEffect, useMemo, useState } from "react";
import { getLeaderboard, getMyRank } from "../services/quiz.service";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
	const [items, setItems] = useState([]);
	const [me, setMe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [dir, setDir] = useState("desc");

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const [list, mine] = await Promise.all([
					getLeaderboard({ page: 1, limit: 100 }),
					getMyRank(),
				]);
				setItems(list);
				setMe(mine);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const filtered = useMemo(() => {
		const s = (q || "").toLowerCase();
		let data = items.filter(
			(x) =>
				x.username.toLowerCase().includes(s) ||
				String(x.best_score ?? "").includes(s) ||
				(x.best_quiz || "").toLowerCase().includes(s)
		);
		if (dir === "asc") data = [...data].reverse();
		return data;
	}, [items, q, dir]);

	// warna skor (sama kayak My Learning)
	const getScoreColor = (score) => {
		if (score >= 80) return "bg-green-100 text-green-700";
		if (score >= 50) return "bg-yellow-100 text-yellow-700";
		return "bg-rose-100 text-rose-700";
	};

	return (
		<motion.div
			className="max-w-5xl mx-auto px-6 py-8"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h1 className="text-4xl font-bold mb-6">Leaderboard</h1>

			{/* search & filter */}
			<div className="flex items-center gap-3 mb-6">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="Cari nama..."
					className="w-full md:w-1/2 border rounded-lg px-3 py-2"
				/>
				<select
					className="border rounded-lg px-3 py-2"
					value={dir}
					onChange={(e) => setDir(e.target.value)}
				>
					<option value="desc">Z→A / Besar→Kecil</option>
					<option value="asc">A→Z / Kecil→Besar</option>
				</select>
			</div>

			{/* Card Posisi User */}
			<div className="rounded-2xl p-5 mb-6 bg-gradient-to-r from-blue-50 to-white shadow-md">
				<div className="flex items-center justify-between">
					{/* Username */}
					<div>
						<p className="text-sm text-gray-500">Posisiku</p>
						<p className="text-2xl font-semibold">
							{me?.username ?? "—"}
						</p>
					</div>

					{/* Rank & Attempt sejajar */}
					<div className="flex gap-4">
						<div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl shadow-sm text-center min-w-[80px]">
							<p className="text-xs font-medium">Rank</p>
							<p className="text-lg font-bold">
								{me?.rank ?? "-"}
							</p>
						</div>
						<div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl shadow-sm text-center min-w-[80px]">
							<p className="text-xs font-medium">Attempt</p>
							<p className="text-lg font-bold">
								{me?.total_entries ?? "-"}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabel Leaderboard */}
			<div className="border rounded-2xl overflow-x-auto">
				<table className="w-full text-left">
					<thead className="bg-blue-50">
						<tr className="text-gray-600">
							<th className="px-4 py-3">Rank</th>
							<th className="px-4 py-3">Nama</th>
							<th className="px-4 py-3">Skor Terbaik</th>
							<th className="px-4 py-3">Kuis</th>
						</tr>
					</thead>
					<tbody>
						{loading && (
							<tr>
								<td
									className="px-4 py-6 text-gray-500"
									colSpan={4}
								>
									Memuat…
								</td>
							</tr>
						)}
						{!loading && filtered.length === 0 && (
							<tr>
								<td
									className="px-4 py-6 text-gray-500"
									colSpan={4}
								>
									Belum ada data.
								</td>
							</tr>
						)}
						{!loading &&
							filtered.map((row) => (
								<tr
									key={row.username}
									className="border-t hover:bg-blue-50/40 transition"
								>
									<td className="px-4 py-3 font-semibold text-blue-600">
										#{row.rank}
									</td>
									<td className="px-4 py-3">
										{row.username}
									</td>
									<td className="px-4 py-3">
										<span
											className={`w-16 inline-block text-center py-1 rounded-full text-sm font-semibold ${getScoreColor(
												row.best_score
											)}`}
										>
											{row.best_score}
										</span>
									</td>
									<td className="px-4 py-3">
										{row.best_quiz}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
}
