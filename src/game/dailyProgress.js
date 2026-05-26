import { getDailyDateKey } from "../api/dailyPoke.js";

const DAILY_PROGRESS_STORAGE_KEY = "pokeguess:daily-progress:v1";

const TERMINAL_STATUSES = new Set(["won", "lost", "gave_up"]);

export function shouldTrackDailyProgress(challengeType) {
	return challengeType === "daily";
}

function canUseLocalStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeNumber(value, fallback = 0) {
	const asNumber = Number(value);
	return Number.isFinite(asNumber) ? asNumber : fallback;
}

function safeParse(raw) {
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function sanitizeStatus(value) {
	if (value === "won" || value === "lost" || value === "gave_up" || value === "in_progress") {
		return value;
	}
	return "in_progress";
}

function sanitizeEntry(raw, fallbackDateKey) {
	if (!raw || typeof raw !== "object") return null;

	const dateKey = typeof raw.dateKey === "string" ? raw.dateKey : fallbackDateKey;
	if (!dateKey) return null;

	return {
		dateKey,
		challengeType: "daily",
		status: sanitizeStatus(raw.status),
		attemptsUsed: Math.max(0, Math.floor(sanitizeNumber(raw.attemptsUsed, 0))),
		pokemonId: Number.isFinite(Number(raw.pokemonId)) ? Number(raw.pokemonId) : null,
		updatedAt:
			typeof raw.updatedAt === "string" && raw.updatedAt.trim().length > 0
				? raw.updatedAt
				: new Date().toISOString(),
	};
}

export function getPreviousUtcDateKey(dateKey) {
	const date = new Date(`${dateKey}T00:00:00.000Z`);
	if (Number.isNaN(date.getTime())) return null;
	date.setUTCDate(date.getUTCDate() - 1);
	return date.toISOString().slice(0, 10);
}

export function createInitialDailyProgress() {
	return {
		version: 1,
		entries: {},
		streak: {
			current: 0,
			best: 0,
			lastWinDateKey: null,
		},
	};
}

export function normalizeDailyProgress(rawValue) {
	const base = createInitialDailyProgress();
	if (!rawValue || typeof rawValue !== "object") return base;

	const rawEntries =
		rawValue.entries && typeof rawValue.entries === "object" ? rawValue.entries : {};
	const entries = {};
	for (const [dateKey, entry] of Object.entries(rawEntries)) {
		if (typeof dateKey !== "string") continue;
		const sanitized = sanitizeEntry(entry, dateKey);
		if (sanitized) entries[dateKey] = sanitized;
	}

	return {
		version: 1,
		entries,
		streak: {
			current: Math.max(0, Math.floor(sanitizeNumber(rawValue.streak?.current, 0))),
			best: Math.max(0, Math.floor(sanitizeNumber(rawValue.streak?.best, 0))),
			lastWinDateKey:
				typeof rawValue.streak?.lastWinDateKey === "string"
					? rawValue.streak.lastWinDateKey
					: null,
		},
	};
}

export function updateStreak(streak, dateKey, status) {
	const currentStreak = Math.max(0, Math.floor(sanitizeNumber(streak?.current, 0)));
	const bestStreak = Math.max(0, Math.floor(sanitizeNumber(streak?.best, 0)));
	const lastWinDateKey =
		typeof streak?.lastWinDateKey === "string" ? streak.lastWinDateKey : null;

	if (status !== "won") {
		return {
			current: 0,
			best: bestStreak,
			lastWinDateKey,
		};
	}

	if (lastWinDateKey === dateKey) {
		return {
			current: currentStreak,
			best: bestStreak,
			lastWinDateKey,
		};
	}

	const previousDateKey = getPreviousUtcDateKey(dateKey);
	const shouldIncrement = previousDateKey && lastWinDateKey === previousDateKey;
	const nextCurrent = shouldIncrement ? currentStreak + 1 : 1;

	return {
		current: nextCurrent,
		best: Math.max(bestStreak, nextCurrent),
		lastWinDateKey: dateKey,
	};
}

export function applyDailyProgressEntry(progress, partialEntry) {
	const normalizedProgress = normalizeDailyProgress(progress);
	const nowIso = new Date().toISOString();
	const dateKey = partialEntry?.dateKey || getDailyDateKey();
	const existingEntry = normalizedProgress.entries[dateKey] || null;
	const incomingEntry = sanitizeEntry(
		{
			...partialEntry,
			dateKey,
			updatedAt: nowIso,
		},
		dateKey
	);

	if (!incomingEntry) return normalizedProgress;

	// Preserve the first final result for a day to avoid post-result overwrites.
	if (existingEntry && TERMINAL_STATUSES.has(existingEntry.status)) {
		return normalizedProgress;
	}

	const nextEntry = {
		...(existingEntry || {}),
		...incomingEntry,
		attemptsUsed: Math.max(existingEntry?.attemptsUsed || 0, incomingEntry.attemptsUsed || 0),
	};

	const nextEntries = {
		...normalizedProgress.entries,
		[dateKey]: nextEntry,
	};

	const nextStreak = TERMINAL_STATUSES.has(nextEntry.status)
		? updateStreak(normalizedProgress.streak, dateKey, nextEntry.status)
		: normalizedProgress.streak;

	return {
		version: 1,
		entries: nextEntries,
		streak: nextStreak,
	};
}

export function readDailyProgress() {
	if (!canUseLocalStorage()) return createInitialDailyProgress();
	const raw = safeParse(window.localStorage.getItem(DAILY_PROGRESS_STORAGE_KEY));
	return normalizeDailyProgress(raw);
}

export function writeDailyProgress(progress) {
	if (!canUseLocalStorage()) return;
	try {
		window.localStorage.setItem(
			DAILY_PROGRESS_STORAGE_KEY,
			JSON.stringify(normalizeDailyProgress(progress))
		);
	} catch {
		// Local storage is best effort for daily QoL only.
	}
}

export function patchDailyProgress(partialEntry) {
	const nextProgress = applyDailyProgressEntry(readDailyProgress(), partialEntry);
	writeDailyProgress(nextProgress);
	return nextProgress;
}

export function getDailyProgressForDate(date = new Date()) {
	const progress = readDailyProgress();
	const dateKey = getDailyDateKey(date);
	return progress.entries[dateKey] || null;
}

export function getDailyStreak() {
	return readDailyProgress().streak;
}

export function isDailyCompletedForDate(date = new Date()) {
	const entry = getDailyProgressForDate(date);
	if (!entry) return false;
	return TERMINAL_STATUSES.has(entry.status);
}
