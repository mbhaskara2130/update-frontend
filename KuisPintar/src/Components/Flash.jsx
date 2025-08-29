// src/Components/Flash.jsx
import React, { useEffect } from "react";

export default function Flash({
	type = "info",
	message = "",
	onClose,
	duration = 3000,
}) {
	useEffect(() => {
		if (!duration) return;
		const t = setTimeout(() => onClose?.(), duration);
		return () => clearTimeout(t);
	}, [duration, onClose]);

	const styles = {
		success: "bg-green-100 text-green-800 border-green-300",
		error: "bg-red-100 text-red-800 border-red-300",
		info: "bg-blue-100 text-blue-800 border-blue-300",
	}[type];

	return (
		<div
			className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 shadow ${styles}`}
		>
			<div className="flex items-start gap-3">
				<span className="font-semibold capitalize">{type}</span>
				<span className="opacity-90">{message}</span>
				<button
					onClick={onClose}
					className="ml-2 rounded px-2 text-sm opacity-70 hover:opacity-100"
					aria-label="Close"
				>
					✕
				</button>
			</div>
		</div>
	);
}
