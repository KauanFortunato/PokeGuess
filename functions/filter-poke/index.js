export const FilterPoke = async (term, setFilteredPokemons) => {
	if (term.length === 0) {
		setFilteredPokemons([]);
		return;
	}

	try {
		const response = await fetch(
			`http://192.168.1.91/PokeGuess/php/api/filter-poke.php?term=${term}`
		);

		const data = await response.json();
		setFilteredPokemons(data);
		// console.log(data);
	} catch (error) {
		console.error('Erro ao buscar o Pokémon', error);
	}
};
