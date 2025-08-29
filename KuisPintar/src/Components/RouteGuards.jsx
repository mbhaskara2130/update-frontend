import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) return <div className="p-6 text-gray-500">Memuat…</div>;
	if (!user)
		return <Navigate to="/login" replace state={{ from: location }} />;

	return children;
}

export function RequireRole({ role = "admin", children }) {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) return <div className="p-6 text-gray-500">Memuat…</div>;
	if (!user)
		return <Navigate to="/login" replace state={{ from: location }} />;

	if ((user.role || "").toLowerCase() !== role.toLowerCase()) {
		return <Navigate to="/" replace state={{ forbidden: true }} />;
	}

	return children;
}
