import getRandomPokemon from '../../firebase/api/randomPoke/index';

// Sortear Pokémon da base de dados
export const useChosenPoke = async (setRandomPokemon) => {
	const randomPoke = await getRandomPokemon();

	if (randomPoke) {
		setRandomPokemon(randomPoke);
	} else {
		return null;
	}
};
