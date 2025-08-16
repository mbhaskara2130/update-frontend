import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExitConfirm from "../Components/ExitConfirm";

export default function QuizPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      question: "Antara berikut ini, mana yang merupakan gaya penulisan yang bersifat objektif?",
      options: ["Sosiokritik", "Argumentatif", "Persuasif", "Ekspositori"],
      answer: "Ekspositori",
    },
    {
      id: 2,
      question: "Hukum Newton yang menjelaskan aksi-reaksi adalah hukum ke?",
      options: ["1", "2", "3", "4"],
      answer: "3",
    },
    {
      id: 3,
      question: "Siapa proklamator kemerdekaan Indonesia?",
      options: ["Soekarno & Hatta", "Soekarno & Sudirman", "Hatta & Tan Malaka", "Soepomo & Yamin"],
      answer: "Soekarno & Hatta",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(90); // 1 menit 30 detik
  const [showExitModal, setShowExitModal] = useState(false); // modal state

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (option) => {
    setSelected({ ...selected, [current]: option });
  };

  const handleFinish = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (selected[i] === q.answer) score++;
    });
    alert(`Skor kamu: ${score} / ${questions.length}`);
    navigate("/");
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="bg-white w-full max-w-3xl shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-600 font-bold text-xl">KuisPintar</h2>
          <button
            onClick={() => setShowExitModal(true)} // tampilkan modal
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-sm"
          >
            Keluar
          </button>
        </div>

        {/* Card Soal */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Soal {current + 1}</h3>
            <span className="flex items-center text-gray-600 text-sm">
              ⏰ {formatTime(timeLeft)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Pertanyaan */}
          <p className="text-gray-800 font-medium mb-4">{questions[current].question}</p>

          {/* Opsi */}
          <div className="space-y-3">
            {questions[current].options.map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`q-${current}`}
                  value={opt}
                  checked={selected[current] === opt}
                  onChange={() => handleOptionChange(opt)}
                  className="form-radio text-blue-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {/* Navigasi */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              className={`px-4 py-2 rounded-lg ${
                current === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Back
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Selesaikan Kuis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Keluar */}
      <ExitConfirm
        show={showExitModal}
        onConfirm={() => navigate("/")} // keluar ke halaman utama
        onCancel={() => setShowExitModal(false)} // batal
      />
    </div>
  );
}
