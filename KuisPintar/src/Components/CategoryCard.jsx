// src/Components/CategoryCard.jsx
import React from "react";

export default function CategoryCard({ icon, title, description, onClick }) {
	return (
		<div
			className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition flex flex-col items-center text-center"
			onClick={onClick}
		>
			<div className="mb-3">{icon}</div>
			<h3 className="text-lg font-bold text-gray-800">{title}</h3>
			<p className="text-gray-600 mt-2 text-sm">{description}</p>
		</div>
	);
}
