// src/App.jsx
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Sections/HeroSections";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import QuizPage from "./Pages/QuizPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import ResultPage from "./Pages/ResultPage";
import MyLearningPage from "./Pages/MyLearningPage";

// Admin
import AdminLayout from "./Layouts/AdminLayout";
import AdminUserPage from "./Pages/Admin/AdminUserPage";
import AdminRolePage from "./Pages/Admin/AdminRolePage";
import AdminQuizPage from "./Pages/Admin/AdminQuizPage";
import QuizFormPage from "./Pages/Admin/QuizFormPage";
import QuizEditPage from "./Pages/Admin/QuizEditPage";

// Main layout
import MainLayout from "./Layouts/MainLayout";

// Guards
import { RequireAuth, RequireRole } from "./Components/RouteGuards";

function App() {
	return (
		<Routes>
			{/* Auth */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />

			{/* User dengan layout utama */}
			<Route
				path="/"
				element={
					<MainLayout>
						<LandingPage />
					</MainLayout>
				}
			/>
			<Route
				path="/leaderboard"
				element={
					<MainLayout>
						<LeaderboardPage />
					</MainLayout>
				}
			/>
			<Route
				path="/learning"
				element={
					<RequireAuth>
						<MainLayout>
							<MyLearningPage />
						</MainLayout>
					</RequireAuth>
				}
			/>

			{/* Halaman kuis & result (tanpa layout utama) */}
			<Route path="/quiz/:id" element={<QuizPage />} />
			<Route path="/result" element={<ResultPage />} />

			{/* Admin (hanya admin) */}
			<Route
				path="/admin"
				element={
					<RequireRole role="admin">
						<AdminLayout />
					</RequireRole>
				}
			>
				<Route path="user" element={<AdminUserPage />} />
				<Route path="role" element={<AdminRolePage />} />
				<Route path="kuis" element={<AdminQuizPage />} />
				<Route path="kuis/add" element={<QuizFormPage />} />
				<Route path="kuis/edit/:id" element={<QuizEditPage />} />
			</Route>
		</Routes>
	);
}

export default App;
