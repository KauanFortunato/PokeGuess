const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

const pokemonCache = new Map();
let allPokemonNames = null;

const typeTranslations = {
	normal: 'Normal',
	fire: 'Fogo',
	water: 'Água',
	electric: 'Elétrico',
	grass: 'Planta',
	ice: 'Gelo',
	fighting: 'Lutador',
	poison: 'Veneno',
	ground: 'Terra',
	flying: 'Voador',
	psychic: 'Psíquico',
	bug: 'Inseto',
	rock: 'Pedra',
	ghost: 'Fantasma',
	dragon: 'Dragão',
	dark: 'Sombrio',
	steel: 'Aço',
	fairy: 'Fada',
};

const colorTranslations = {
	black: 'Preto',
	blue: 'Azul',
	brown: 'Marrom',
	gray: 'Cinza',
	green: 'Verde',
	pink: 'Rosa',
	purple: 'Roxo',
	red: 'Vermelho',
	white: 'Branco',
	yellow: 'Amarelo',
};

const habitatTranslations = {
	cave: 'Caverna',
	forest: 'Floresta',
	grassland: 'Campestre',
	mountain: 'Montanha',
	rare: 'Raro',
	'rough-terrain': 'Terreno Acidentado',
	sea: 'Mar',
	urban: 'Urbano',
	'waters-edge': 'Beira-mar',
};

function capitalize(name) {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('-');
}

export function getIdFromUrl(url) {
	return url.split('/').filter(Boolean).pop();
}

function getEvolutionStage(chain, pokemonName, stage = 1) {
	if (chain.species.name === pokemonName) return stage;
	for (const evo of chain.evolves_to) {
		const result = getEvolutionStage(evo, pokemonName, stage + 1);
		if (result !== null) return result;
	}
	return null;
}

export function getPokeSpriteUrl(id) {
	return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchAllPokemonNames() {
	if (allPokemonNames) return allPokemonNames;
	const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=898`);
	if (!response.ok) throw new Error('Falha ao buscar lista de Pokémon');
	const data = await response.json();
	allPokemonNames = data.results;
	return allPokemonNames;
}

export async function fetchPokemonData(nameOrId) {
	const key = nameOrId.toString().toLowerCase();
	if (pokemonCache.has(key)) return pokemonCache.get(key);

	const pokemonRes = await fetch(`${POKEAPI_BASE}/pokemon/${key}`);
	if (!pokemonRes.ok) throw new Error(`Pokémon não encontrado: ${key}`);
	const pokemon = await pokemonRes.json();

	const speciesRes = await fetch(pokemon.species.url);
	if (!speciesRes.ok) throw new Error(`Espécie não encontrada para: ${key}`);
	const species = await speciesRes.json();

	const evolutionRes = await fetch(species.evolution_chain.url);
	if (!evolutionRes.ok) throw new Error(`Cadeia de evolução não encontrada para: ${key}`);
	const evolutionData = await evolutionRes.json();

	const evolutionStage = getEvolutionStage(evolutionData.chain, pokemon.name) || 1;

	const normalized = {
		key: pokemon.id.toString(),
		nome: capitalize(pokemon.name),
		tipo1:
			typeTranslations[pokemon.types[0].type.name] ||
			capitalize(pokemon.types[0].type.name),
		tipo2: pokemon.types[1]
			? typeTranslations[pokemon.types[1].type.name] ||
			  capitalize(pokemon.types[1].type.name)
			: null,
		cor: colorTranslations[species.color.name] || capitalize(species.color.name),
		habitat: species.habitat
			? habitatTranslations[species.habitat.name] || capitalize(species.habitat.name)
			: 'Desconhecido',
		altura: (pokemon.height / 10).toFixed(1) + 'm',
		peso: (pokemon.weight / 10).toFixed(1) + 'kg',
		numero_evolucao: evolutionStage,
		img_poke:
			pokemon.sprites.other?.['official-artwork']?.front_default ||
			pokemon.sprites.front_default,
	};

	pokemonCache.set(key, normalized);
	pokemonCache.set(pokemon.id.toString(), normalized);
	pokemonCache.set(pokemon.name, normalized);

	return normalized;
}
