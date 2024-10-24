import { db } from '../../config/firebaseConfig';
import { collection, getDoc, getDocs } from 'firebase/firestore';

export const searchPokemon = async (pokeTerm) => {
	try {
		const pokemonsSnapshot = await getDocs(collection(db, 'pokemons'));
	} catch {}
};
