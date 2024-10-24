export const comparePokemons = (inputPokemon, randomPokemon) => {
	const result = {};

	result.nome =
		inputPokemon.toLowerCase() === randomPokemon.nome.toLowerCase() ? 'true' : 'false';
	result.tipo1 =
		inputPokemon.toLowerCase() === randomPokemon.tipo1.toLowerCase() ? 'true' : 'false';

	if (randomPokemon.tipo2) {
		result.tipo2 =
			inputPokemon.toLowerCase() === randomPokemon.tipo2.toLowerCase() ? 'true' : 'false';
	} else {
		result.tipo2 = 'null';
	}

	result.cor = inputPokemon.toLowerCase() === randomPokemon.cor.toLowerCase() ? 'true' : 'false';
	result.habitat =
		inputPokemon.toLowerCase() === randomPokemon.habitat.toLowerCase() ? 'true' : 'false';
	result.altura =
		inputPokemon.toLowerCase() === randomPokemon.altura.toString() ? 'true' : 'false';
	result.peso = inputPokemon.toLowerCase() === randomPokemon.peso.toString() ? 'true' : 'false';
	result.numero_evolucao =
		inputPokemon === randomPokemon.numero_evolucao.toString() ? 'true' : 'false';

	return `
        Nome: ${result.nome}
        Tipo 1: ${result.tipo1}
        Tipo 2: ${result.tipo2}
        Cor: ${result.cor}
        Habitat: ${result.habitat}
        Altura: ${result.altura}
        Peso: ${result.peso}
        Numero de Evolucao: ${result.numero_evolucao}
    `;
};
