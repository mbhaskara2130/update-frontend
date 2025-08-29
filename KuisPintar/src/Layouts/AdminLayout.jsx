// src/Layouts/AdminLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { SearchProvider, useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

function AdminLayoutInner() {
	const { query, setQuery } = useSearch();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const displayName = user?.username || user?.email || "admin";
	const roleLabel = (user?.role || "admin").toString(); // ✅ CHANGED: pastikan string
	const showRoleChip =
		roleLabel &&
		roleLabel.toLowerCase() !== (displayName || "").toLowerCase(); // ✅ CHANGED: tampilkan chip kalau beda

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			{/* Container utama */}
			<div className="flex w-full h-[95vh] mx-6 my-6 bg-white rounded-3xl shadow-xl overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 bg-gradient-to-b from-blue-500 to-blue-400 text-white p-6">
					<div className="text-2xl font-bold mb-8">
						Admin Kuis Pintar
					</div>

					<nav className="space-y-2">
						<NavLink
							to="/admin/user"
							className={({ isActive }) =>
								`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
									isActive
										? "bg-blue-600 text-white font-semibold shadow"
										: "text-white/90 hover:bg-blue-500/80"
								}`
							}
						>
							<Icon icon="mdi:account-group" width="20" />
							Data User
						</NavLink>

						<NavLink
							to="/admin/role"
							className={({ isActive }) =>
								`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
									isActive
										? "bg-blue-600 text-white font-semibold shadow"
										: "text-white/90 hover:bg-blue-500/80"
								}`
							}
						>
							<Icon
								icon="clarity:administrator-solid"
								width="20"
							/>
							Data Admin
						</NavLink>

						<NavLink
							to="/admin/kuis"
							className={({ isActive }) =>
								`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
									isActive
										? "bg-blue-600 text-white font-semibold shadow"
										: "text-white/90 hover:bg-blue-500/80"
								}`
							}
						>
							<Icon
								icon="mdi:book-open-page-variant"
								width="20"
							/>
							Kuis
						</NavLink>
					</nav>
				</aside>

				{/* Konten */}
				<main className="flex-1 flex flex-col bg-gray-50">
					{/* Header */}
					<div className="flex flex-wrap gap-4 justify-between items-center p-4 md:p-6 border-b border-gray-100 bg-white shadow-sm">
						{/* Search */}
						<div className="relative w-full sm:w-72">
							<Icon
								icon="mdi:magnify"
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								width="20"
							/>
							<input
								type="text"
								placeholder="Search..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>

						{/* User Info + Logout */}
						<div className="flex items-center gap-3 ml-auto">
							{showRoleChip && ( // ✅ CHANGED: chip role hanya muncul kalau beda dari username
								<span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 capitalize">
									{roleLabel}
								</span>
							)}
							<span className="text-gray-800 font-semibold">
								{displayName}
							</span>
							<button
								onClick={handleLogout}
								className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition text-sm"
								title="Logout"
							>
								<Icon icon="mdi:logout" width={18} />
							</button>
						</div>
					</div>

					{/* Konten dinamis */}
					<div className="flex-1 p-6 md:p-8 overflow-y-auto">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}

export default function AdminLayout() {
	return (
		<SearchProvider>
			<AdminLayoutInner />
		</SearchProvider>
	);
}
