import React, { useEffect, useMemo, useState } from "react";
import { getMyLearning } from "../services/quiz.service";
import { motion } from "framer-motion";

function parseToDate(dt) {
	if (!dt) return null;
	if (dt instanceof Date) return dt;
	if (typeof dt === "number") return new Date(dt);
	if (typeof dt === "string") {
		const s = dt.trim();
		if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
			return new Date(s.replace(" ", "T") + "Z");
		}
		return new Date(s);
	}
	return null;
}

function fmt(dt) {
	const t = parseToDate(dt);
	if (!t || Number.isNaN(t.getTime())) return dt || "-";
	return new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Jakarta",
	}).format(t);
}

export default function MyLearningPage() {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [order, setOrder] = useState("time");
	const [dir, setDir] = useState("desc");

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const data = await getMyLearning({ page: 1, limit: 200 });
				setRows(data);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const filtered = useMemo(() => {
		const s = (q || "").toLowerCase();
		let data = rows.filter(
			(r) =>
				(r.quiz_title || "—").toLowerCase().includes(s) ||
				String(r.score ?? "").includes(s)
		);
		const getVal = (r) =>
			order === "score"
				? Number(r.score || 0)
				: parseToDate(r.created_at)?.getTime() ?? 0;
		data.sort((a, b) => {
			const va = getVal(a);
			const vb = getVal(b);
			return dir === "asc" ? va - vb : vb - va;
		});
		return data;
	}, [rows, q, order, dir]);

	const getScoreColor = (score) => {
		if (score >= 80) return "bg-green-100 text-green-700";
		if (score >= 50) return "bg-yellow-100 text-yellow-700";
		return "bg-rose-100 text-rose-700";
	};

	return (
		<motion.div
			className="max-w-6xl mx-auto px-6 py-10"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Judul */}
			<h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
				My Learning
			</h1>

			{/* Search & Filter */}
			<div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 mb-6">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="🔍 Cari judul / skor…"
					className="flex-1 min-w-[220px] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>
				<select
					value={order}
					onChange={(e) => setOrder(e.target.value)}
					className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
				>
					<option value="time">Urutkan: Waktu</option>
					<option value="score">Urutkan: Skor</option>
				</select>
				<select
					value={dir}
					onChange={(e) => setDir(e.target.value)}
					className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
				>
					<option value="desc">Z→A / Besar→Kecil</option>
					<option value="asc">A→Z / Kecil→Besar</option>
				</select>
			</div>

			{/* Tabel */}
			<div className="overflow-hidden border rounded-2xl shadow">
				<table className="w-full text-left">
					<thead className="bg-blue-50">
						<tr className="text-gray-700">
							<th className="px-5 py-3 font-semibold">
								Judul Kuis
							</th>
							<th className="px-5 py-3 font-semibold">Skor</th>
							<th className="px-5 py-3 font-semibold">Benar</th>
							<th className="px-5 py-3 font-semibold">Salah</th>
							<th className="px-5 py-3 font-semibold">Waktu</th>
						</tr>
					</thead>
					<tbody>
						{loading && (
							<tr>
								<td
									className="px-5 py-6 text-gray-500 text-center"
									colSpan={5}
								>
									Memuat…
								</td>
							</tr>
						)}
						{!loading && filtered.length === 0 && (
							<tr>
								<td
									className="px-5 py-6 text-gray-500 text-center"
									colSpan={5}
								>
									Belum ada riwayat attempt.
								</td>
							</tr>
						)}
						{!loading &&
							filtered.map((r, i) => (
								<tr
									key={`${r.created_at ?? "no-ts"}-${i}`}
									className="border-t hover:bg-blue-50/40 transition"
								>
									<td className="px-5 py-3">
										{r.quiz_title}
									</td>
									<td className="px-5 py-3">
										<span
											className={`w-16 inline-block text-center py-1 rounded-full text-sm font-semibold ${getScoreColor(
												r.score
											)}`}
										>
											{r.score}
										</span>
									</td>
									<td className="px-5 py-3 text-green-600 font-medium">
										{r.correct_count}
									</td>
									<td className="px-5 py-3 text-rose-600 font-medium">
										{r.wrong_count}
									</td>
									<td className="px-5 py-3">
										{fmt(r.created_at)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
}
