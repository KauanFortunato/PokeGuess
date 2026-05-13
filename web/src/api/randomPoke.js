import { fetchPokemonData } from './pokeApiService';
import { randomIdFromGens, ALL_GENS } from '../game/gens';

export default async function getRandomPokemon(gens = ALL_GENS) {
	const id = randomIdFromGens(gens);
	return await fetchPokemonData(id.toString());
}
