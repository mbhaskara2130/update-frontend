import React from "react";

export default function ConfirmModal({ category, onConfirm, onCancel }) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 border border-blue-200">
        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
          Mulai kuis {category}?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow"
          >
            Mulai
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
