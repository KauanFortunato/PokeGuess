import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const REMINDER_STORAGE_KEY = "pokeguess:daily-reminder:v1";
const DAILY_REMINDER_NOTIFICATION_ID = 730001;

const DEFAULT_REMINDER_SETTINGS = {
	enabled: false,
	hour: 19,
	minute: 0,
	lastPermissionStatus: "unknown",
};

function canUseLocalStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(raw) {
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function clamp(value, min, max, fallback) {
	const asNumber = Number(value);
	if (!Number.isFinite(asNumber)) return fallback;
	return Math.min(max, Math.max(min, Math.floor(asNumber)));
}

export function formatReminderTime(hour, minute) {
	const h = String(clamp(hour, 0, 23, DEFAULT_REMINDER_SETTINGS.hour)).padStart(2, "0");
	const m = String(clamp(minute, 0, 59, DEFAULT_REMINDER_SETTINGS.minute)).padStart(2, "0");
	return `${h}:${m}`;
}

export function parseReminderTime(rawTime) {
	if (typeof rawTime !== "string") {
		return { hour: DEFAULT_REMINDER_SETTINGS.hour, minute: DEFAULT_REMINDER_SETTINGS.minute };
	}

	const match = rawTime.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return { hour: DEFAULT_REMINDER_SETTINGS.hour, minute: DEFAULT_REMINDER_SETTINGS.minute };
	}

	return {
		hour: clamp(match[1], 0, 23, DEFAULT_REMINDER_SETTINGS.hour),
		minute: clamp(match[2], 0, 59, DEFAULT_REMINDER_SETTINGS.minute),
	};
}

export function normalizeReminderSettings(raw) {
	if (!raw || typeof raw !== "object") {
		return { ...DEFAULT_REMINDER_SETTINGS };
	}

	return {
		enabled: Boolean(raw.enabled),
		hour: clamp(raw.hour, 0, 23, DEFAULT_REMINDER_SETTINGS.hour),
		minute: clamp(raw.minute, 0, 59, DEFAULT_REMINDER_SETTINGS.minute),
		lastPermissionStatus:
			typeof raw.lastPermissionStatus === "string"
				? raw.lastPermissionStatus
				: DEFAULT_REMINDER_SETTINGS.lastPermissionStatus,
	};
}

export function readReminderSettings() {
	if (!canUseLocalStorage()) return { ...DEFAULT_REMINDER_SETTINGS };
	return normalizeReminderSettings(
		safeParse(window.localStorage.getItem(REMINDER_STORAGE_KEY))
	);
}

export function writeReminderSettings(nextSettings) {
	if (!canUseLocalStorage()) return;
	try {
		window.localStorage.setItem(
			REMINDER_STORAGE_KEY,
			JSON.stringify(normalizeReminderSettings(nextSettings))
		);
	} catch {
		// Local preference persistence is best effort.
	}
}

export function isNativeReminderSupported() {
	return (
		Capacitor.isNativePlatform() &&
		(Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios") &&
		Capacitor.isPluginAvailable("LocalNotifications")
	);
}

export function getReminderSupportMessage() {
	if (isNativeReminderSupported()) return null;
	return "Daily reminders are available in the mobile app build.";
}

export async function checkReminderPermission() {
	if (!isNativeReminderSupported()) {
		return { granted: false, status: "unsupported" };
	}

	const permission = await LocalNotifications.checkPermissions();
	return {
		granted: permission.display === "granted",
		status: permission.display,
	};
}

export async function requestReminderPermission() {
	if (!isNativeReminderSupported()) {
		return { granted: false, status: "unsupported" };
	}

	const permission = await LocalNotifications.requestPermissions();
	return {
		granted: permission.display === "granted",
		status: permission.display,
	};
}

export async function cancelDailyReminderNotification() {
	if (!isNativeReminderSupported()) return;

	await LocalNotifications.cancel({
		notifications: [{ id: DAILY_REMINDER_NOTIFICATION_ID }],
	});
}

export async function scheduleDailyReminderNotification({ hour, minute }) {
	if (!isNativeReminderSupported()) {
		return { ok: false, reason: "unsupported" };
	}

	await cancelDailyReminderNotification();
	await LocalNotifications.schedule({
		notifications: [
			{
				id: DAILY_REMINDER_NOTIFICATION_ID,
				title: "Pokemon do dia disponivel",
				body: "O Pokemon do dia ja esta disponivel!",
				schedule: {
					on: {
						hour: clamp(hour, 0, 23, DEFAULT_REMINDER_SETTINGS.hour),
						minute: clamp(minute, 0, 59, DEFAULT_REMINDER_SETTINGS.minute),
					},
					repeats: true,
					allowWhileIdle: true,
				},
				extra: {
					target: "daily",
				},
			},
		],
	});

	return { ok: true };
}

export async function registerDailyReminderOpenListener(onDailyOpen) {
	if (!isNativeReminderSupported() || typeof onDailyOpen !== "function") {
		return () => {};
	}

	const listener = await LocalNotifications.addListener(
		"localNotificationActionPerformed",
		(event) => {
			const notification = event?.notification;
			const isDailyTarget =
				notification?.id === DAILY_REMINDER_NOTIFICATION_ID ||
				notification?.extra?.target === "daily";
			if (isDailyTarget) onDailyOpen();
		}
	);

	return async () => {
		try {
			await listener.remove();
		} catch {
			// noop
		}
	};
}
