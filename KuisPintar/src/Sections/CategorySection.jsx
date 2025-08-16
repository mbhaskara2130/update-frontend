import React, { useState } from "react";
import CategoryCard from "../Components/CategoryCard";
import ConfirmModal from "../Components/ConfirmModal"; // import modal
import { useNavigate } from "react-router-dom";
import { FaFlask, FaGraduationCap, FaLightbulb, FaBook } from "react-icons/fa";
import { GiEarthAmerica, GiAtom } from "react-icons/gi";

const categories = [
  { title: "Matematika", description: "Asah kemampuan berhitungmu", icon: <FaLightbulb className="text-yellow-500 text-4xl" /> },
  { title: "IPA", description: "Pelajari sains dengan cara seru", icon: <GiEarthAmerica className="text-green-500 text-4xl" /> },
  { title: "Bahasa Indonesia", description: "Tingkatkan literasi dan tata bahasa", icon: <FaBook className="text-orange-400 text-4xl" /> },
  { title: "Kimia", description: "Belajar reaksi & senyawa kimia", icon: <FaFlask className="text-orange-500 text-4xl" /> },
  { title: "Sejarah", description: "Kenali peristiwa penting dunia", icon: <FaGraduationCap className="text-yellow-600 text-4xl" /> },
  { title: "Fisika", description: "Eksperimen dengan hukum alam", icon: <GiAtom className="text-blue-500 text-4xl" /> },
];

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (selectedCategory) {
navigate(`/quiz/${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <section
      id="kategori"
      className="bg-white rounded-t-3xl shadow-inner -mt-10 pt-16 pb-24 px-8 md:px-16 lg:px-32"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Daftar Kategori Kuis
      </h2>
      <p className="text-center text-gray-500 mt-2">
        Pilih kategori favoritmu dan mulai belajar sekarang
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {categories.map((cat, i) => (
          <CategoryCard
            key={i}
            icon={cat.icon}
            title={cat.title}
            description={cat.description}
            onClick={() => setSelectedCategory(cat.title)}
          />
        ))}
      </div>

      {/* Pakai modal modular */}
      <ConfirmModal
        category={selectedCategory}
        onConfirm={handleStartQuiz}
        onCancel={() => setSelectedCategory(null)}
      />
    </section>
  );
}
