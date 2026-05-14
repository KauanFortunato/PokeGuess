import { fetchPokemonData } from './pokeApiService.js';

const MAX_POKEMON_ID = 898;
const DAILY_CACHE_PREFIX = 'pokeguess:daily-target:';

export function getDailyDateKey(date = new Date()) {
	return date.toISOString().slice(0, 10);
}

export function getDailyPokemonId(dateKey = getDailyDateKey()) {
	let hash = 2166136261;
	for (let i = 0; i < dateKey.length; i++) {
		hash ^= dateKey.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return (Math.abs(hash) % MAX_POKEMON_ID) + 1;
}

function readCachedDaily(dateKey, id) {
	if (typeof window === 'undefined' || !window.localStorage) return null;

	try {
		const raw = window.localStorage.getItem(`${DAILY_CACHE_PREFIX}${dateKey}`);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed?.dateKey !== dateKey || parsed?.id !== id || !parsed?.pokemon) return null;
		return parsed.pokemon;
	} catch {
		return null;
	}
}

function writeCachedDaily(dateKey, id, pokemon) {
	if (typeof window === 'undefined' || !window.localStorage) return;

	try {
		window.localStorage.setItem(
			`${DAILY_CACHE_PREFIX}${dateKey}`,
			JSON.stringify({ dateKey, id, pokemon })
		);
	} catch {
		// Cache is an optimization only; gameplay should continue if storage is unavailable.
	}
}

export async function getDailyPokemon(date = new Date()) {
	const dateKey = getDailyDateKey(date);
	const id = getDailyPokemonId(dateKey);
	const cached = readCachedDaily(dateKey, id);
	if (cached) return cached;

	const pokemon = await fetchPokemonData(id.toString());
	writeCachedDaily(dateKey, id, pokemon);
	return pokemon;
}
