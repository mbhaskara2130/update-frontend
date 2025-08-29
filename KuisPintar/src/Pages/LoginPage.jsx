import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const { loginWithToken } = useAuth();

	const [form, setForm] = useState({ username: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	const canSubmit = form.username.trim() && form.password && !loading;

	const handleChange = (e) =>
		setForm((s) => ({ ...s, [e.target.id]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!canSubmit) return;

		setErrMsg("");
		setLoading(true);

		try {
			const { data } = await api.post("/api/auth/login", {
				username: form.username.trim(),
				password: form.password,
			});

			// ✅ simpan token + user ke context (juga akan ke localStorage)
			loginWithToken(data.token, data.user);

			// ✅ (opsional) redirect berdasar role
			if (data?.user?.role === "admin") {
				navigate("/admin/kuis");
			} else {
				navigate("/");
			}
		} catch (err) {
			const msg =
				err.response?.data?.message ||
				err.response?.data?.error ||
				"Login gagal. Periksa username / password.";
			setErrMsg(msg);

			// ✅ opsional: kosongkan password
			setForm((s) => ({ ...s, password: "" }));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
				<div className="px-8 py-4 border-b border-gray-200">
					<h2 className="text-blue-600 text-2xl font-bold">
						KuisPintar
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2">
					<div className="p-8 flex flex-col justify-center">
						<h3 className="text-2xl font-bold mb-6">Login</h3>

						<form className="space-y-5" onSubmit={handleSubmit}>
							{/* Username */}
							<div className="relative">
								<input
									type="text"
									id="username"
									value={form.username}
									onChange={handleChange}
									placeholder=" "
									autoComplete="username"
									className="peer w-full px-3 pt-5 pb-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
									value={form.password}
									onChange={handleChange}
									placeholder=" "
									autoComplete="current-password"
									className="peer w-full px-3 pt-5 pb-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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

							{/* Error */}
							{errMsg && (
								<p className="text-sm text-red-600">{errMsg}</p>
							)}

							{/* Button */}
							<button
								type="submit"
								disabled={!canSubmit}
								className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition"
							>
								{loading ? "Masuk..." : "Login"}
							</button>
						</form>

						<p className="text-gray-600 text-sm mt-4 text-center">
							Belum punya akun?{" "}
							<Link
								to="/register"
								className="text-blue-500 hover:underline"
							>
								Daftar di sini
							</Link>
						</p>
					</div>

					<div className="bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
						<h3 className="text-2xl font-bold mb-2">
							Selamat Datang!
						</h3>
						<p className="text-gray-600 mb-6">
							Sistem Kuis Interaktif
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
