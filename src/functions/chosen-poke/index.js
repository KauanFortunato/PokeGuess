import getRandomPokemon from '../../api/randomPoke';

// Sortear Pokémon da base de dados
export const useChosenPoke = async (setRandomPokemon) => {
	const randomPoke = await getRandomPokemon();

	if (randomPoke) {
		setRandomPokemon(randomPoke);
	} else {
		return null;
	}
};
