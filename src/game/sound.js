import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { isMuted } from './feedback';

let configured = false;

async function ensureConfigured() {
	if (configured) return;
	try {
		await setAudioModeAsync({
			playsInSilentMode: true,
			shouldPlayInBackground: false,
			interruptionMode: 'mixWithOthers',
		});
		configured = true;
	} catch {
		configured = true;
	}
}

export function getCryUrl(id) {
	return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}

export function getLegacyCryUrl(id) {
	return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${id}.ogg`;
}

export async function playCry(pokemonId) {
	if (isMuted()) return null;
	if (!pokemonId) return null;
	if (Platform.OS === 'web') {
		try {
			const audio = new window.Audio(getCryUrl(pokemonId));
			audio.volume = 0.6;
			audio.play().catch(() => {});
			return audio;
		} catch {
			return null;
		}
	}
	try {
		await ensureConfigured();
		const player = createAudioPlayer({ uri: getCryUrl(pokemonId) });
		player.volume = 0.6;
		player.play();
		setTimeout(() => {
			try {
				player.remove();
			} catch {}
		}, 4000);
		return player;
	} catch {
		return null;
	}
}
