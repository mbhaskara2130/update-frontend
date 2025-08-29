import React from "react";
import { Icon } from "@iconify/react";

export default function CategoryCard({ title, description, onClick }) {
	return (
		<div
			className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all flex flex-col items-center text-center"
			onClick={onClick}
		>
			{/* Icon buku sama untuk semua kategori */}
			<div className="mb-4 w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white text-3xl shadow-md">
				<Icon
					icon="mdi:book-open-page-variant"
					width="28"
					height="28"
				/>
			</div>

			{/* Title */}
			<h3 className="text-lg font-bold text-gray-800">{title}</h3>

			{/* Description */}
			<p className="text-gray-600 mt-2 text-sm">{description}</p>
		</div>
	);
}
