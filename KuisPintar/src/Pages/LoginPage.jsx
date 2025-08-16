import React, { useState } from "react";
import loginImage from "../assets/image.png"; // ganti sesuai path gambar
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200">
          <h2 className="text-blue-600 text-2xl font-bold">KuisPintar</h2>
        </div>

        {/* Konten */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Kiri - Form */}
          <div className="p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Login</h3>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full px-3 pt-5 pb-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-[14px]
                    peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                >
                  Email
                </label>
                <Icon
                  icon="mdi:email-outline"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full px-3 pt-5 pb-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-[14px]
                    peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                >
                  Password
                </label>
                <Icon
                  icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  width={20}
                  height={20}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>

              {/* Tombol Login */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Login
              </button>
            </form>

            {/* Link daftar */}
            <p className="text-gray-600 text-sm mt-4 text-center">
              Belum punya akun?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>

          {/* Kanan - Welcome */}
          <div className="bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Selamat Datang!</h3>
            <p className="text-gray-600 mb-6">Sistem Kuis Interaktif</p>
            <img
              src={loginImage}
              alt="Ilustrasi Login"
              className="w-56 md:w-64 lg:w-72"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
