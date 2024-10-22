import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Função para buscar um Pokémon aleatório do Firestore
export const randomPoke = async (setPokemon) => {
	try {
		const snapshot = await firestore().collection('pokemons').get();
		if (!snapshot.empty) {
			const pokemonList = snapshot.docs.map((doc) => doc.data());

			const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];

			console.log('Pokémon sorteado com sucesso:', randomPokemon);

			setPokemon(randomPokemon);
		} else {
			Alert.alert('Erro', 'Não foi possível encontrar nenhum Pokémon.');
		}
	} catch (error) {
		console.error('Erro ao buscar Pokémon:', error);
		Alert.alert('Erro', 'Falha ao conectar com o Firebase.');
	}
};
