// src/Pages/RegisterPage.jsx
import React, { useState } from "react";
import registerImage from "../assets/image.png";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { api } from "../lib/api";

export default function RegisterPage() {
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});

	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const handleChange = (e) =>
		setFormData((s) => ({ ...s, [e.target.id]: e.target.value }));

	const isMatch = formData.password === formData.confirmPassword;
	const canSubmit =
		!!formData.username.trim() &&
		!!formData.password &&
		isMatch &&
		!loading;

	const handleRegister = async (e) => {
		e.preventDefault();
		if (!canSubmit) return;

		setErrorMsg("");
		setLoading(true);

		try {
			await api.post("/api/auth/register", {
				username: formData.username.trim(),
				password: formData.password,
			});

			navigate("/login");
		} catch (err) {
			if (err.response?.status === 409) {
				setErrorMsg("Username sudah dipakai. Coba yang lain ya.");
			} else {
				setErrorMsg(
					err.response?.data?.message ||
						err.response?.data?.error ||
						"Registrasi gagal. Coba lagi."
				);
			}
			setFormData((s) => ({ ...s, password: "", confirmPassword: "" }));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-3xl">
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-blue-600 text-2xl font-bold">
						KuisPintar
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2">
					{/* Form Register */}
					<div className="p-6 flex flex-col justify-center">
						<h3 className="text-2xl font-bold mb-6">Daftar</h3>

						<form className="space-y-5" onSubmit={handleRegister}>
							{/* Username */}
							<div className="relative">
								<input
									type="text"
									id="username"
									value={formData.username}
									onChange={handleChange}
									placeholder=" "
									autoComplete="username"
									className="peer w-full px-3 pt-5 pb-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
									required
								/>
								<label
									htmlFor="username"
									className="absolute left-3 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-[14px] peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
								>
									Username
								</label>
								<Icon
									icon="mdi:account-outline"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
									width={20}
									height={20}
								/>
							</div>

							{/* Password */}
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									value={formData.password}
									onChange={handleChange}
									placeholder=" "
									autoComplete="new-password"
									className={`peer w-full px-3 pt-5 pb-2 pr-10 border rounded-md focus:outline-none focus:ring-2
                    ${
						!isMatch && formData.confirmPassword
							? "border-red-400 focus:ring-red-300"
							: "border-gray-300 focus:ring-blue-400"
					}`}
									required
								/>
								<label
									htmlFor="password"
									className="absolute left-3 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-[14px] peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
								>
									Password
								</label>
								<Icon
									icon={
										showPassword
											? "mdi:eye-off-outline"
											: "mdi:eye-outline"
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
									width={20}
									height={20}
									onClick={() => setShowPassword((v) => !v)}
								/>
							</div>

							{/* Konfirmasi Password */}
							<div className="relative">
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									id="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder=" "
									autoComplete="new-password"
									className={`peer w-full px-3 pt-5 pb-2 pr-10 border rounded-md focus:outline-none focus:ring-2
                    ${
						!isMatch && formData.confirmPassword
							? "border-red-400 focus:ring-red-300"
							: "border-gray-300 focus:ring-blue-400"
					}`}
									required
								/>
								<label
									htmlFor="confirmPassword"
									className="absolute left-3 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-[14px] peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
								>
									Konfirmasi Password
								</label>
								<Icon
									icon={
										showConfirmPassword
											? "mdi:eye-off-outline"
											: "mdi:eye-outline"
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
									width={20}
									height={20}
									onClick={() =>
										setShowConfirmPassword((v) => !v)
									}
								/>
							</div>

							{formData.confirmPassword && !isMatch && (
								<p className="text-xs text-red-600 -mt-3">
									Password tidak sama
								</p>
							)}

							<button
								type="submit"
								disabled={!canSubmit}
								className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition"
							>
								{loading ? "Mendaftar..." : "Daftar"}
							</button>
						</form>

						{errorMsg && (
							<p className="text-red-600 text-sm mt-3">
								{errorMsg}
							</p>
						)}

						<p className="text-gray-600 text-sm mt-4 text-center">
							Sudah punya akun?{" "}
							<Link
								to="/login"
								className="text-blue-500 hover:underline"
							>
								Login di sini
							</Link>
						</p>
					</div>

					{/* Kanan - Welcome */}
					<div className="bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
						<h3 className="text-2xl font-bold mb-2">
							Ayo Bergabung!
						</h3>
						<p className="text-gray-600 mb-6">
							Buat akunmu sekarang
						</p>
						<img
							src={registerImage}
							alt="Ilustrasi Register"
							className="w-48 md:w-56 lg:w-64"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
