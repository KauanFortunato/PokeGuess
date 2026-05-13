import { fetchAllPokemonNames, getPokeSpriteUrl, getIdFromUrl } from './pokeApiService';

function capitalize(name) {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-');
}

export const FilterPoke = async (term, setFilteredPokemons) => {
	if (term.length === 0) {
		setFilteredPokemons([]);
		return;
	}

	try {
		const allNames = await fetchAllPokemonNames();
		const matches = allNames
			.filter((p) => p.name.startsWith(term.toLowerCase()))
			.slice(0, 8);

		// Retorna itens leves com sprite predizível — dados completos são buscados ao selecionar
		const lightItems = matches.map((p) => {
			const id = getIdFromUrl(p.url);
			return {
				key: id,
				nome: capitalize(p.name),
				img_poke: getPokeSpriteUrl(id),
				_apiId: id,
			};
		});

		setFilteredPokemons(lightItems);
	} catch (error) {
		console.error('Erro ao filtrar Pokémon:', error);
		setFilteredPokemons([]);
	}
};
