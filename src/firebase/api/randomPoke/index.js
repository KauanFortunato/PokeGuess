import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const getRandomPokemon = async () => {
	try {
		// Acesse a coleção 'pokemons' no Firestore
		const pokemonsSnapshot = await getDocs(collection(db, 'pokemons'));
		const pokemonList = pokemonsSnapshot.docs.map((doc) => ({
			...doc.data(),
			key: doc.id,
		}));

		if (pokemonList.length > 0) {
			const randomIndex = Math.floor(Math.random() * pokemonList.length);
			// console.log(pokemonList[randomIndex]);
			return pokemonList[randomIndex];
		}
	} catch (error) {
		console.error('Erro ao sortear Pokémon: ', error);
	}
	return null;
};

export default getRandomPokemon;
