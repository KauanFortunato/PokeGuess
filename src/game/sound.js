import { isMuted } from './feedback';

export function getCryUrl(id) {
	return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}

export function getLegacyCryUrl(id) {
	return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${id}.ogg`;
}

export async function playCry(pokemonId) {
	if (isMuted()) return null;
	if (!pokemonId) return null;
	try {
		const audio = new Audio(getCryUrl(pokemonId));
		audio.volume = 0.6;
		audio.play().catch(() => {
			// Fallback to legacy cry if latest fails
			const legacy = new Audio(getLegacyCryUrl(pokemonId));
			legacy.volume = 0.6;
			legacy.play().catch(() => {});
		});
		return audio;
	} catch {
		return null;
	}
}
