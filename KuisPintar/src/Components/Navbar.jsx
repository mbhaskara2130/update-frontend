// src/Components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

export default function Navbar() {
	const location = useLocation();

	const menu = [
		{ name: "Home", path: "/" },
		{ name: "My Learning", path: "/learning" },
		{ name: "Leaderboard", path: "/leaderboard" },
	];

	return (
		<nav className="w-full bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
			<h1 className="text-xl font-bold text-blue-600">KuisPintar</h1>

			<div className="hidden md:flex items-center gap-6">
				{menu.map((item) => (
					<Link
						key={item.name}
						to={item.path}
						className={`text-gray-600 font-medium relative pb-1 ${
							location.pathname === item.path
								? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600"
								: "hover:text-blue-600"
						}`}
					>
						{item.name}
					</Link>
				))}
			</div>

			<div className="flex items-center gap-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Search..."
						className="border border-gray-300 rounded-lg pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					<Search
						className="absolute right-2 top-2 text-gray-400"
						size={16}
					/>
				</div>
				<Link
					to="/login"
					className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition text-sm"
				>
					Login
				</Link>
			</div>
		</nav>
	);
}
