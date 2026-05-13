export const comparePokemons = (inputPokemon, randomPokemon) => {
	const result = {};

	result.nome =
		(inputPokemon.nome?.toLowerCase() || '') === (randomPokemon.nome?.toLowerCase() || '')
			? 'true'
			: 'false';

	if ((inputPokemon.tipo1?.toLowerCase() || '') === (randomPokemon.tipo1?.toLowerCase() || '')) {
		result.tipo1 = 'true';
	} else if (
		(inputPokemon.tipo1?.toLowerCase() || '') === (randomPokemon.tipo2?.toLowerCase() || '')
	) {
		result.tipo1 = 'parcial';
	} else {
		result.tipo1 = 'false';
	}

	if ((inputPokemon.tipo2?.toLowerCase() || '') === (randomPokemon.tipo2?.toLowerCase() || '')) {
		result.tipo2 = 'true';
	} else if (
		(inputPokemon.tipo2?.toLowerCase() || '') === (randomPokemon.tipo1?.toLowerCase() || '')
	) {
		result.tipo2 = 'parcial';
	} else {
		result.tipo2 = 'false';
	}

	result.cor =
		(inputPokemon.cor?.toLowerCase() || '') === (randomPokemon.cor?.toLowerCase() || '')
			? 'true'
			: 'false';

	result.habitat =
		(inputPokemon.habitat?.toLowerCase() || '') === (randomPokemon.habitat?.toLowerCase() || '')
			? 'true'
			: 'false';

	result.altura =
		(inputPokemon.altura?.toString() || '') === (randomPokemon.altura?.toString() || '')
			? 'true'
			: 'false';

	result.peso =
		(inputPokemon.peso?.toString() || '') === (randomPokemon.peso?.toString() || '')
			? 'true'
			: 'false';

	result.numero_evolucao =
		(inputPokemon.numero_evolucao?.toString() || '') ===
		(randomPokemon.numero_evolucao?.toString() || '')
			? 'true'
			: 'false';

	return {
		nome: result.nome,
		tipo1: result.tipo1,
		tipo2: result.tipo2,
		cor: result.cor,
		habitat: result.habitat,
		altura: result.altura,
		peso: result.peso,
		numero_evolucao: result.numero_evolucao,
	};
};
