import React, { createContext, useContext, useEffect, useState } from "react";

function parseJwt(token) {
	try {
		const base64Url = token.split(".")[1];
		if (!base64Url) return null;
		const json = atob(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
		return JSON.parse(decodeURIComponent(escape(json)));
	} catch {
		return null;
	}
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("user");
		return saved ? JSON.parse(saved) : null;
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const t = localStorage.getItem("token");
		const savedUser = localStorage.getItem("user");

		if (savedUser) {
			setUser(JSON.parse(savedUser));
			setToken(t || null);
			setLoading(false);
			return;
		}

		if (t) {
			const payload = parseJwt(t);
			setToken(t);

			if (payload && (payload.username || payload.name || payload.sub)) {
				setUser({
					id: payload.id ?? payload.sub ?? null,
					username: payload.username ?? payload.name ?? null,
					role: payload.role ?? null,
				});
			} else {
				setUser(null);
			}
		} else {
			setToken(null);
			setUser(null);
		}
		setLoading(false);
	}, []);

	function loginWithToken(jwt, userPayload) {
		localStorage.setItem("token", jwt);
		setToken(jwt);

		if (userPayload) {
			localStorage.setItem("user", JSON.stringify(userPayload));
			setUser(userPayload);
		} else {
			const payload = parseJwt(jwt);
			if (payload && (payload.username || payload.name || payload.sub)) {
				const u = {
					id: payload.id ?? payload.sub ?? null,
					username: payload.username ?? payload.name ?? null,
					role: payload.role ?? null,
				};
				localStorage.setItem("user", JSON.stringify(u));
				setUser(u);
			} else {
				localStorage.removeItem("user");
				setUser(null);
			}
		}
	}

	function logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setToken(null);
		setUser(null);
	}

	return (
		<AuthContext.Provider
			value={{ token, user, loading, loginWithToken, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
