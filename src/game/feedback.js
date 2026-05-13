// Web haptics via Vibration API. iOS Safari does not support it — gracefully no-ops.
let muted = false;

export function setMuted(value) {
	muted = !!value;
}

export function isMuted() {
	return muted;
}

function vibrate(pattern) {
	if (muted) return;
	if (typeof navigator === 'undefined' || !navigator.vibrate) return;
	try {
		navigator.vibrate(pattern);
	} catch {}
}

export const haptics = {
	tap: () => vibrate(10),
	light: () => vibrate(15),
	medium: () => vibrate(30),
	heavy: () => vibrate(50),
	success: () => vibrate([20, 40, 20]),
	warning: () => vibrate([15, 30, 15]),
	error: () => vibrate([60, 80, 60]),
};

export function hapticForKind(kind) {
	if (kind === 'match') haptics.success();
	else if (kind === 'partial') haptics.warning();
	else haptics.light();
}
