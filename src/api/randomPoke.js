import { Alert } from 'react-native';
import { fetchPokemonData } from './pokeApiService';

const MAX_POKEMON_ID = 898;

const getRandomPokemon = async () => {
	try {
		const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
		return await fetchPokemonData(randomId.toString());
	} catch (error) {
		console.error('Erro ao sortear Pokémon:', error);
		Alert.alert('Erro', 'Falha ao buscar Pokémon. Verifique sua conexão.');
		return null;
	}
};

export default getRandomPokemon;
