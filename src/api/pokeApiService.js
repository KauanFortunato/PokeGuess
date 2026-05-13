const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

const pokemonCache = new Map();
const inflight = new Map();
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
	grassland: 'Campo',
	mountain: 'Montanha',
	rare: 'Raro',
	'rough-terrain': 'Acidentado',
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

export function getPokeSpriteUrl(id) {
	return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

const GEN_BUCKETS = [
	{ gen: 1, max: 151 },
	{ gen: 2, max: 251 },
	{ gen: 3, max: 386 },
	{ gen: 4, max: 493 },
	{ gen: 5, max: 649 },
	{ gen: 6, max: 721 },
	{ gen: 7, max: 809 },
	{ gen: 8, max: 898 },
];

export function getGenerationFromId(id) {
	const n = Number(id);
	for (const b of GEN_BUCKETS) if (n <= b.max) return b.gen;
	return 8;
}

export async function fetchAllPokemonNames() {
	if (allPokemonNames) return allPokemonNames;
	const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=898`);
	if (!response.ok) throw new Error('Falha ao buscar lista de Pokémon');
	const data = await response.json();
	allPokemonNames = data.results;
	return allPokemonNames;
}

function getEvolutionStage(chain, pokemonName, stage = 1) {
	if (chain.species.name === pokemonName) return stage;
	for (const evo of chain.evolves_to) {
		const result = getEvolutionStage(evo, pokemonName, stage + 1);
		if (result !== null) return result;
	}
	return null;
}

async function loadPokemon(key) {
	const [pokemonRes, speciesRes] = await Promise.all([
		fetch(`${POKEAPI_BASE}/pokemon/${key}`),
		fetch(`${POKEAPI_BASE}/pokemon-species/${key}`),
	]);
	if (!pokemonRes.ok) throw new Error(`Pokémon não encontrado: ${key}`);
	if (!speciesRes.ok) throw new Error(`Espécie não encontrada para: ${key}`);

	const [pokemon, species] = await Promise.all([
		pokemonRes.json(),
		speciesRes.json(),
	]);

	let evolutionStage = 1;
	try {
		const evoRes = await fetch(species.evolution_chain.url);
		if (evoRes.ok) {
			const evoData = await evoRes.json();
			evolutionStage = getEvolutionStage(evoData.chain, pokemon.name) || 1;
		}
	} catch {
		evolutionStage = 1;
	}

	const tipo1 =
		typeTranslations[pokemon.types[0].type.name] ||
		capitalize(pokemon.types[0].type.name);
	const tipo2 = pokemon.types[1]
		? typeTranslations[pokemon.types[1].type.name] ||
		  capitalize(pokemon.types[1].type.name)
		: null;
	const tipos = tipo2 ? [tipo1, tipo2] : [tipo1];

	const alturaM = pokemon.height / 10;
	const pesoKg = pokemon.weight / 10;

	const normalized = {
		key: pokemon.id.toString(),
		id: pokemon.id,
		nome: capitalize(pokemon.name),
		tipo1,
		tipo2,
		tipos,
		cor: colorTranslations[species.color.name] || capitalize(species.color.name),
		habitat: species.habitat
			? habitatTranslations[species.habitat.name] || capitalize(species.habitat.name)
			: 'Desconhec.',
		altura: alturaM.toFixed(1) + 'm',
		peso: pesoKg.toFixed(1) + 'kg',
		alturaM,
		pesoKg,
		geracao: getGenerationFromId(pokemon.id),
		evolucao: evolutionStage,
		img_poke:
			pokemon.sprites.other?.['official-artwork']?.front_default ||
			pokemon.sprites.front_default,
		sprite_pixel: getPokeSpriteUrl(pokemon.id),
	};

	pokemonCache.set(pokemon.id.toString(), normalized);
	pokemonCache.set(pokemon.name, normalized);
	return normalized;
}

export async function fetchPokemonData(nameOrId) {
	const key = nameOrId.toString().toLowerCase();
	if (pokemonCache.has(key)) return pokemonCache.get(key);
	if (inflight.has(key)) return inflight.get(key);

	const promise = loadPokemon(key).finally(() => inflight.delete(key));
	inflight.set(key, promise);
	const result = await promise;
	pokemonCache.set(key, result);
	return result;
}

export function prefetchPokemonData(nameOrId) {
	const key = nameOrId.toString().toLowerCase();
	if (pokemonCache.has(key) || inflight.has(key)) return;
	const promise = loadPokemon(key)
		.catch(() => null)
		.finally(() => inflight.delete(key));
	inflight.set(key, promise);
}
