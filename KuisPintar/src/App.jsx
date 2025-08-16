// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import LandingPage from "./Sections/HeroSections";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage"; 
import QuizPage from "./Pages/QuizPage";
import LeaderboardPage from "./Pages/LeaderboardPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />{" "}
                <Route path="/quiz/:categoryId" element={<QuizPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
				<Route path="/" element={<MainLayout><LandingPage /></MainLayout>}/>
			</Routes>
		</Router>
	);
}

export default App;
