import React from "react";
import CategorySection from "./CategorySection";
import heroImage from "../assets/image.png";

export default function HeroSection() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 ">
			{/* Hero Section */}
			<section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 max-w-7xl mx-auto">
				<div className="md:w-1/2 text-center md:text-left">
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
						Belajar Jadi Lebih{" "}
						<span className="text-blue-600">Menyenangkan</span>
					</h1>
					<p className="text-gray-600 mt-4 text-lg">
						Ikuti kuis interaktif, uji kemampuanmu, dan tingkatkan
						pengetahuanmu dengan cara yang seru dan mudah.
					</p>

					<div className="flex gap-4 mt-8 justify-center md:justify-start">
						<button
							onClick={() => {
								const kategoriSection =
									document.getElementById("kategori");
								if (kategoriSection) {
									kategoriSection.scrollIntoView({
										behavior: "smooth",
									});
								}
							}}
							className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition cursor-pointer"
						>
							Mulai Sekarang
						</button>
					</div>
				</div>

				<div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
					<img
						src={heroImage}
						alt="Ilustrasi Belajar"
						className="w-72 md:w-96 lg:w-[450px] drop-shadow-lg"
					/>
				</div>
			</section>

			{/* Section Kategori */}
			<CategorySection />
		</div>
	);
}
