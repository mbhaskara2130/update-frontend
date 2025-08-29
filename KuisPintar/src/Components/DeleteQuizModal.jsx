import React from "react";

export default function DeleteQuizModal({ isOpen, onClose, onConfirm, quiz }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-200/50 z-50">
			<div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold text-gray-800 mb-4">
					Hapus Kuis
				</h2>
				<p className="text-gray-600 mb-6">
					Apakah kamu yakin ingin menghapus kuis{" "}
					<span className="font-semibold text-red-600">
						{quiz?.title}
					</span>
					? Tindakan ini tidak bisa dibatalkan.
				</p>

				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg border hover:bg-gray-100"
					>
						Batal
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
					>
						Hapus
					</button>
				</div>
			</div>
		</div>
	);
}
