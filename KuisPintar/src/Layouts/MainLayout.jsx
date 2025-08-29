import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

export default function MainLayout({ children }) {
	const location = useLocation();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Navbar />
			<main className="flex-1 overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.4, ease: "easeInOut" }}
						className="h-full"
					>
						{children}
					</motion.div>
				</AnimatePresence>
			</main>
			<Footer />
		</div>
	);
}
