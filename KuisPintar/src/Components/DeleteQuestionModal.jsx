import React, { useEffect, useRef } from "react";

export default function DeleteQuestionModal({
	isOpen,
	onClose,
	onConfirm,
	question,
	loading = false,
	error = "",
}) {
	const dialogRef = useRef(null);

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e) => e.key === "Escape" && !loading && onClose?.();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isOpen, loading, onClose]);

	useEffect(() => {
		if (isOpen && dialogRef.current) {
			const btn = dialogRef.current.querySelector("[data-primary]");
			btn?.focus();
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="dq-title"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget && !loading) onClose?.();
			}}
		>
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			<div
				ref={dialogRef}
				className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-5"
			>
				<h3
					id="dq-title"
					className="text-lg font-semibold text-gray-800"
				>
					Hapus Soal?
				</h3>

				<p className="mt-2 text-gray-600 text-sm">
					Tindakan ini akan menghapus soal
					{question?.text ? (
						<>
							{" "}
							<span className="font-medium text-gray-800">
								“{question.text}”
							</span>
						</>
					) : null}
					. Tindakan tidak bisa dibatalkan.
				</p>

				{error ? (
					<div className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
						{error}
					</div>
				) : null}

				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-60"
						onClick={onClose}
						disabled={loading}
					>
						Batal
					</button>

					<button
						type="button"
						data-primary
						onClick={onConfirm}
						disabled={loading}
						className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
					>
						{loading ? (
							<>
								<span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white border-t-transparent" />
								Menghapus…
							</>
						) : (
							"Ya, Hapus"
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
