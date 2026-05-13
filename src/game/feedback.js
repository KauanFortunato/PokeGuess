import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

let muted = false;

export function setMuted(value) {
	muted = !!value;
}

export function isMuted() {
	return muted;
}

function safe(fn) {
	if (muted) return;
	if (Platform.OS === 'web') return;
	try {
		fn();
	} catch {}
}

export const haptics = {
	tap: () => safe(() => Haptics.selectionAsync()),
	light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
	medium: () =>
		safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
	heavy: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
	success: () =>
		safe(() =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		),
	warning: () =>
		safe(() =>
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
		),
	error: () =>
		safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};

export function hapticForKind(kind) {
	if (kind === 'match') haptics.success();
	else if (kind === 'partial') haptics.warning();
	else haptics.light();
}
