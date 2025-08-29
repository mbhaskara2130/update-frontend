import { api } from "../lib/api";

export async function getLeaderboard({ page = 1, limit = 100 } = {}) {
	const { data } = await api.get("/api/leaderboard", {
		params: { page, limit },
	});
	return Array.isArray(data) ? data : [];
}

export async function getMyLeaderboard() {
	const { data } = await api.get("/api/leaderboard/me");
	return data || null;
}

export default { getLeaderboard, getMyLeaderboard };
