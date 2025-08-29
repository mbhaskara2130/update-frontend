// src/Pages/Admin/DataUserPage.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useSearch } from "../../context/SearchContext";

function formatDate(iso) {
	if (!iso) return "-";
	try {
		return new Date(iso).toLocaleString();
	} catch {
		return iso;
	}
}

export default function DataUserPage() {
	const { query } = useSearch();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	async function load() {
		setLoading(true);
		setError("");
		try {
			const { data } = await api.get("/api/admin/users");
			setUsers(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(
				e?.response?.data?.error ||
					e?.response?.data?.message ||
					e.message ||
					"Gagal memuat user"
			);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	// filter lokal (username cocok query)
	const q = query.trim().toLowerCase();
	const filtered = !q
		? users
		: users.filter((u) =>
				String(u.username || "")
					.toLowerCase()
					.includes(q)
		  );

	if (loading) return <div className="p-6 text-gray-600">Memuat data…</div>;

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">Data User</h2>
				<div className="flex items-center gap-2">
					{error && (
						<span className="text-sm text-rose-600">{error}</span>
					)}
					<button
						onClick={load}
						className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
					>
						Refresh
					</button>
				</div>
			</div>

			<div className="overflow-hidden rounded-xl shadow border border-gray-200">
				<table className="w-full text-left border-collapse">
					<thead className="bg-blue-100">
						<tr>
							<th className="p-3 text-sm font-semibold text-gray-700 w-14">
								No
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700 w-1/3">
								Username
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700 w-28">
								Role
							</th>
							<th className="p-3 text-sm font-semibold text-gray-700 w-1/3">
								Dibuat pada
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((u, idx) => (
							<tr
								key={u.id}
								className="hover:bg-gray-50 transition"
							>
								<td className="p-3 text-sm text-gray-600">
									{idx + 1}
								</td>
								<td className="p-3 text-sm text-gray-800 font-medium">
									{u.username}
								</td>
								<td className="p-3 text-sm">
									<span
										className={`px-2 py-1 rounded-lg text-xs font-medium ${
											String(u.role).toLowerCase() ===
											"user"
												? "bg-emerald-100 text-emerald-700"
												: "bg-gray-200 text-gray-700"
										}`}
									>
										{u.role}
									</span>
								</td>
								<td className="p-3 text-sm text-gray-600">
									{formatDate(u.created_at)}
								</td>
							</tr>
						))}

						{filtered.length === 0 && !error && (
							<tr>
								<td
									className="p-4 text-center text-gray-500 text-sm"
									colSpan={4}
								>
									{q
										? "Tidak ada user yang cocok."
										: "Belum ada user."}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
