import { fetchPokemonData } from './pokeApiService';
import { randomIdFromGens, ALL_GENS } from '../game/gens';

const getRandomPokemon = async (gens = ALL_GENS) => {
	const id = randomIdFromGens(gens);
	return await fetchPokemonData(id.toString());
};

export default getRandomPokemon;
