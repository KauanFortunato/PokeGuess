import { db } from '../../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Função para filtrar os Pokémons que foram inseridos pelas pessoas
export const FilterPoke = async (term, setFilteredPokemons) => {
	if (term.length === 0) {
		setFilteredPokemons([]);
		return;
	}

	try {
		const pokemonQuery = query(
			collection(db, 'pokemons'),
			where('nome', '>=', term),
			where('nome', '<=', term + '\uf8ff')
		);

		// Faz a busca no firebase
		const pokemonsSnapshot = await getDocs(pokemonQuery);
		const pokemonList = pokemonsSnapshot.docs.map((doc) => ({
			...doc.data(),
			key: doc.id, // Coloca o id como chave
		}));

		// console.log('Pokémons retornados:', pokemonList);

		setFilteredPokemons(pokemonList);
	} catch (error) {
		console.error('Erro ao buscar o Pokémon', error);
		setFilteredPokemons([]);
	}
};
