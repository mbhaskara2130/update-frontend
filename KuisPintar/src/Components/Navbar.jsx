import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const displayName = user?.username;

	const menu = [
		{ name: "Home", path: "/" },
		{ name: "My Learning", path: "/learning" },
		{ name: "Leaderboard", path: "/leaderboard" },
	];

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="w-full bg-gradient-to-b from-blue-100 to-white border-b border-gray-200 px-8 py-3 flex items-center justify-between shadow-sm">
			<h1 className="text-xl font-bold text-blue-600">KuisPintar</h1>

			{/* Menu */}
			<div className="hidden md:flex items-center gap-6">
				{menu.map((item) => (
					<Link
						key={item.name}
						to={item.path}
						className={`text-gray-600 font-medium relative pb-1 transition-colors ${
							location.pathname === item.path
								? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600"
								: "hover:text-blue-600"
						}`}
					>
						{item.name}
					</Link>
				))}
			</div>

			{/* Kanan */}
			<div className="flex items-center gap-4">
				{displayName ? (
					<div className="flex items-center gap-3">
						<span className="text-gray-800 font-semibold text-base">
							{displayName}
						</span>
						<button
							onClick={handleLogout}
							className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-sm"
						>
							<Icon icon="mdi:logout" width={16} height={16} />
						</button>
					</div>
				) : (
					<Link
						to="/login"
						className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition text-sm"
					>
						Login
					</Link>
				)}
			</div>
		</nav>
	);
}
