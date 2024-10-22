import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Função para buscar um Pokémon aleatório do Firestore
export const randomPoke = async (setPokemon) => {
	try {
		// Pegue todos os documentos da coleção 'pokemons'
		const snapshot = await firestore().collection('pokemons').get();

		// Verifique se há documentos
		if (!snapshot.empty) {
			// Obtenha uma lista de Pokémon
			const pokemonList = snapshot.docs.map((doc) => doc.data());

			// Escolha um Pokémon aleatório da lista
			const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];

			console.log('Pokémon sorteado com sucesso:', randomPokemon);

			// Atualize o estado com o Pokémon sorteado
			setPokemon(randomPokemon);
		} else {
			Alert.alert('Erro', 'Não foi possível encontrar nenhum Pokémon.');
		}
	} catch (error) {
		console.error('Erro ao buscar Pokémon:', error);
		Alert.alert('Erro', 'Falha ao conectar com o Firebase.');
	}
};
