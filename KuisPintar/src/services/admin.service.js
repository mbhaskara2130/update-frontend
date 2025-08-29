import { api } from "../lib/api";

function raise(err, fallback = "Terjadi kesalahan") {
	const msg =
		err?.response?.data?.error ||
		err?.response?.data?.message ||
		err?.message ||
		fallback;
	const e = new Error(msg);
	e.status = err?.response?.status;
	throw e;
}

/** GET /api/admin/users  -> array [{id, username, role, created_at}] */
export async function getUsers() {
	try {
		const { data } = await api.get("/api/admin/users");
		return Array.isArray(data) ? data : [];
	} catch (err) {
		raise(err, "Gagal memuat daftar user");
	}
}

/** GET /api/admin/admins -> array [{id, username, role:'admin', created_at}] */
export async function getAdmins() {
	try {
		const { data } = await api.get("/api/admin/admins");
		return Array.isArray(data) ? data : [];
	} catch (err) {
		raise(err, "Gagal memuat daftar admin");
	}
}

export default { getUsers, getAdmins };
