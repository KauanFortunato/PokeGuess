export const comparePokemons = (inputPokemon, randomPokemon) => {
	const result = {};

	// Comparar nome (considerando possíveis valores nulos)
	result.nome =
		(inputPokemon.nome?.toLowerCase() || '') === (randomPokemon.nome?.toLowerCase() || '')
			? 'true'
			: 'false';

	// Comparar tipo1
	result.tipo1 =
		(inputPokemon.tipo1?.toLowerCase() || '') === (randomPokemon.tipo1?.toLowerCase() || '')
			? 'true'
			: 'false';

	// Comparar tipo2, se ambos forem null será true, se um for null e outro não, será false
	result.tipo2 =
		(inputPokemon.tipo2?.toLowerCase() || null) === (randomPokemon.tipo2?.toLowerCase() || null)
			? 'true'
			: 'false';

	// Comparar cor
	result.cor =
		(inputPokemon.cor?.toLowerCase() || '') === (randomPokemon.cor?.toLowerCase() || '')
			? 'true'
			: 'false';

	// Comparar habitat
	result.habitat =
		(inputPokemon.habitat?.toLowerCase() || '') === (randomPokemon.habitat?.toLowerCase() || '')
			? 'true'
			: 'false';

	// Comparar altura
	result.altura =
		(inputPokemon.altura?.toString() || '') === (randomPokemon.altura?.toString() || '')
			? 'true'
			: 'false';

	// Comparar peso
	result.peso =
		(inputPokemon.peso?.toString() || '') === (randomPokemon.peso?.toString() || '')
			? 'true'
			: 'false';

	// Comparar número de evolução
	result.numero_evolucao =
		(inputPokemon.numero_evolucao?.toString() || '') ===
		(randomPokemon.numero_evolucao?.toString() || '')
			? 'true'
			: 'false';

	// Resultado final da comparação
	const comparisonResult = {
		nome: result.nome,
		tipo1: result.tipo1,
		tipo2: result.tipo2,
		cor: result.cor,
		habitat: result.habitat,
		altura: result.altura,
		peso: result.peso,
		numero_evolucao: result.numero_evolucao,
	};

	// console.log(comparisonResult);
	return comparisonResult;
};
