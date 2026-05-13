import {
	fetchAllPokemonNames,
	getPokeSpriteUrl,
	getIdFromUrl,
	prefetchPokemonData,
} from './pokeApiService';
import { isInGens, ALL_GENS } from '../game/gens';

function capitalize(name) {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-');
}

export const FilterPoke = async (term, setFilteredPokemons, gens = ALL_GENS) => {
	if (term.length === 0) {
		setFilteredPokemons([]);
		return;
	}

	try {
		const allNames = await fetchAllPokemonNames();
		const matches = allNames
			.filter((p) => {
				if (!p.name.startsWith(term.toLowerCase())) return false;
				const id = Number(getIdFromUrl(p.url));
				return isInGens(id, gens);
			})
			.slice(0, 8);

		const lightItems = matches.map((p) => {
			const id = getIdFromUrl(p.url);
			return {
				key: id,
				nome: capitalize(p.name),
				img_poke: getPokeSpriteUrl(id),
				_apiId: id,
			};
		});

		setFilteredPokemons(lightItems);

		// Prefetch the top suggestions so tap-to-submit is instant
		for (const it of lightItems.slice(0, 5)) {
			prefetchPokemonData(it._apiId);
		}
	} catch (error) {
		console.error('Erro ao filtrar Pokémon:', error);
		setFilteredPokemons([]);
	}
};
