import { api } from "../lib/api";

/*Utils */
function raise(err, fallback = "Terjadi kesalahan") {
	const msg =
		err?.response?.data?.error ||
		err?.response?.data?.message ||
		err?.message ||
		fallback;
	const status = err?.response?.status;
	const e = new Error(msg);
	if (status) e.status = status;
	throw e;
}


export function validateQuestionForm({ text, options, correctIndex }) {
	const errors = {};

	if (!text || !String(text).trim()) errors.text = "Pertanyaan wajib diisi.";

	const opts = Array.isArray(options)
		? options.map((o) => String(o || "").trim())
		: [];
	if (opts.length < 2) {
		errors.options = "Minimal punya 2 opsi jawaban.";
	} else {
		opts.forEach((o, i) => {
			if (!o) errors[`option_${i + 1}`] = "Opsi tidak boleh kosong.";
		});
	}

	const idx = Number(correctIndex);
	if (!Number.isInteger(idx) || idx < 0 || idx >= opts.length) {
		errors.correctIndex = "Index jawaban benar tidak valid.";
	}

	return { ok: Object.keys(errors).length === 0, errors };
}

/* Normalizer Question */
function parseOptions(row) {
	if (Array.isArray(row?.options)) return row.options;
	try {
		return JSON.parse(row?.options_json || "[]");
	} catch {
		return [];
	}
}

function normalizeQuestionRow(row) {
	const options = parseOptions(row);
	let correctIndex = Number(row?.correct_index);
	if (!Number.isFinite(correctIndex)) correctIndex = -1;
	if (correctIndex < 0 || correctIndex >= options.length) correctIndex = -1;

	return {
		id: row.id,
		text: row.text || row.question || "",
		options,
		correctIndex,
	};
}

/* Quizzes */
export async function getQuizzes({ page = 1, limit = 20 } = {}) {
	try {
		const { data } = await api.get("/api/quizzes", {
			params: { page, limit },
		});
		return Array.isArray(data) ? data : data?.items || [];
	} catch (err) {
		raise(err, "Gagal memuat daftar kuis");
	}
}

export async function getQuizById(id) {
	try {
		const { data } = await api.get(`/api/quizzes/${id}`);
		return data;
	} catch (err) {
		const status = err?.response?.status;
		if (status === 404) {
			try {
				const { data: list } = await api.get("/api/quizzes", {
					params: { page: 1, limit: 200 },
				});
				const arr = Array.isArray(list) ? list : list?.items || [];
				const found = arr.find((q) => Number(q.id) === Number(id));
				if (found) return found;
				return {
					id,
					title: `Kuis #${id}`,
					description: "",
					is_public: true,
				};
			} catch {
				return {
					id,
					title: `Kuis #${id}`,
					description: "",
					is_public: true,
				};
			}
		}
		raise(err, "Gagal memuat detail kuis");
	}
}

export async function createQuiz({
	title,
	description = "",
	is_public = true,
}) {
	try {
		const payload = { title, description, is_public };
		const { data } = await api.post("/api/quizzes", payload, {
			headers: { "Content-Type": "application/json" },
		});
		return data;
	} catch (err) {
		raise(err, "Gagal membuat kuis");
	}
}

export async function updateQuiz(id, { title, description, is_public }) {
	try {
		const payload = {};
		if (title !== undefined) payload.title = title;
		if (description !== undefined) payload.description = description;
		if (is_public !== undefined) payload.is_public = is_public;

		const { data } = await api.put(`/api/quizzes/${id}`, payload, {
			headers: { "Content-Type": "application/json" },
		});
		return data;
	} catch (err) {
		raise(err, "Gagal memperbarui kuis");
	}
}

export async function removeQuiz(id) {
	try {
		const { data } = await api.delete(`/api/quizzes/${id}`);
		return data;
	} catch (err) {
		raise(err, "Gagal menghapus kuis");
	}
}
export const deleteQuiz = removeQuiz;

/* Questions */
export async function getQuizQuestions(quizId, { page = 1, limit = 100 } = {}) {
	try {
		const { data } = await api.get(`/api/quizzes/${quizId}/questions`, {
			params: { page, limit },
		});
		const rows = Array.isArray(data) ? data : [];
		return rows.map(normalizeQuestionRow);
	} catch (err) {
		raise(err, "Gagal memuat pertanyaan");
	}
}
export async function getQuestionsByQuiz(quizId, opts) {
	return getQuizQuestions(quizId, opts);
}

export async function addQuestion(quizId, { text, options, correctIndex }) {
	try {
		const { ok, errors } = validateQuestionForm({
			text,
			options,
			correctIndex,
		});
		if (!ok) {
			const e = new Error("Validasi soal gagal");
			e.validation = errors;
			throw e;
		}

		const payload = { text, options, correct_index: Number(correctIndex) };
		const { data } = await api.post(
			`/api/quizzes/${quizId}/questions`,
			payload,
			{ headers: { "Content-Type": "application/json" } }
		);
		return data;
	} catch (err) {
		raise(err, "Gagal menambahkan soal");
	}
}

export async function updateQuestion(
	quizId,
	questionId,
	{ text, options, correctIndex }
) {
	const payload = { text, options, correct_index: Number(correctIndex) };

	try {
		const { data } = await api.put(
			`/api/quizzes/questions/${questionId}`,
			payload,
			{ headers: { "Content-Type": "application/json" } }
		);
		return data;
	} catch (e) {
		const st = e?.response?.status;
		if (st === 404 || st === 405) {
			try {
				const { data } = await api.put(
					`/api/quizzes/${quizId}/questions/${questionId}`,
					payload,
					{ headers: { "Content-Type": "application/json" } }
				);
				return data;
			} catch (e2) {
				raise(e2, "Gagal memperbarui soal");
			}
		}
		raise(e, "Gagal memperbarui soal");
	}
}

export async function deleteQuestion(questionId) {
	try {
		const { data } = await api.delete(
			`/api/quizzes/questions/${questionId}`
		);
		return data;
	} catch (err) {
		raise(err, "Gagal menghapus soal");
	}
}

/* Helpers */
export async function getQuizzesWithCounts({ page = 1, limit = 20 } = {}) {
	const quizzes = await getQuizzes({ page, limit });
	const counts = await Promise.all(
		quizzes.map(async (q) => {
			try {
				const questions = await getQuizQuestions(q.id);
				return questions.length;
			} catch {
				return 0;
			}
		})
	);
	return quizzes.map((q, i) => ({ ...q, questions_count: counts[i] }));
}
export async function getPublicQuizzes({ page = 1, limit = 100 } = {}) {
	const list = await getQuizzes({ page, limit });
	return list.filter((q) => !!q.is_public);
}

/* Attempts & Submit Result */
export async function createAttempt(quizId) {
	try {
		const { data } = await api.post(`/api/attempts/${quizId}`);
		return data;
	} catch {
		return null;
	}
}

export async function submitQuizResult(
	quizId,
	{ attempt_id = null, username, correct, wrong, score, answers = {} }
) {
	try {
		const payload = {
			attempt_id,
			answers,
			username,
			correct,
			wrong,
			score,
		};

		const { data } = await api.post(`/api/submit/${quizId}`, payload, {
			headers: { "Content-Type": "application/json" },
		});
		return data;
	} catch (err) {
		const e = new Error(
			err?.response?.data?.error ||
				err?.message ||
				"Gagal submit hasil kuis"
		);
		e.status = err?.response?.status;
		throw e;
	}
}

/*Leaderboard (sesuai BE) */
export async function getLeaderboard({ quizId, page = 1, limit = 100 } = {}) {
	try {
		const { data } = await api.get("/api/leaderboard", {
			params: { quizId, page, limit },
		});
		const rows = Array.isArray(data) ? data : [];
		return rows.map((r) => ({
			rank: Number(r.rank ?? 0),
			username: r.username ?? r.name ?? "-",
			best_score: Number(r.best_score ?? r.score ?? 0),
			best_quiz: r.best_quiz ?? r.quiz_title ?? "-",
		}));
	} catch (err) {
		raise(err, "Gagal memuat leaderboard");
	}
}

export async function getMyRank({ quizId } = {}) {
	try {
		const { data } = await api.get("/api/leaderboard/me", {
			params: { quizId },
		});
		return {
			username: data?.username ?? "-",
			best_score:
				data?.best_score == null ? null : Number(data.best_score),
			best_quiz: data?.best_quiz ?? null,
			rank:
				data?.rank == null || Number.isNaN(Number(data.rank))
					? null
					: Number(data.rank),
			total_entries: Number(data?.total_entries ?? 0),
		};
	} catch (err) {
		if (err?.status === 401) return null;
		raise(err, "Gagal memuat peringkat saya");
	}
}
export const getMyLeaderboard = getMyRank;

/* My Learning */
export async function getMyLearning({ page = 1, limit = 200 } = {}) {
	try {
		const { data } = await api.get("/api/mylearning", {
			params: { page, limit },
		});
		const rows = Array.isArray(data) ? data : [];
		return rows.map((r) => ({
			quiz_title: r.quiz_title ?? r.title ?? "—",
			score: Number(r.score ?? 0),
			correct_count: Number(r.correct_count ?? 0),
			wrong_count: Number(r.wrong_count ?? 0),
			created_at: r.created_at,
			_raw: r,
		}));
	} catch (err) {
		raise(err, "Gagal memuat riwayat pembelajaran");
	}
}

export const listQuizzes = getQuizzes;

export default {
	getQuizzes,
	listQuizzes,
	getQuizById,
	createQuiz,
	updateQuiz,
	removeQuiz,
	deleteQuiz,
	getQuizzesWithCounts,
	getQuizQuestions,
	getQuestionsByQuiz,
	addQuestion,
	updateQuestion,
	deleteQuestion,
	validateQuestionForm,
	getPublicQuizzes,
	createAttempt,
	submitQuizResult,
	getLeaderboard,
	getMyRank,
	getMyLeaderboard,
	getMyLearning,
};
