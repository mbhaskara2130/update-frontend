import React from "react";

export default function SubmitConfirm({ show, onConfirm, onCancel }) {
	if (!show) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 border border-green-200">
				<h3 className="text-lg font-bold mb-4 text-center text-gray-800">
					Apakah kamu yakin ingin menyelesaikan kuis?
				</h3>
				<p className="text-center text-gray-600 mb-6 text-sm">
					Jawaban yang sudah dipilih akan langsung disimpan dan
					hasilnya ditampilkan.
				</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={onConfirm}
						className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 shadow"
					>
						Ya, Selesaikan
					</button>
					<button
						onClick={onCancel}
						className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 shadow"
					>
						Batal
					</button>
				</div>
			</div>
		</div>
	);
}
