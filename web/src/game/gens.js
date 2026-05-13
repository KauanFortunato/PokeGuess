export const GEN_RANGES = {
	1: { min: 1, max: 151 },
	2: { min: 152, max: 251 },
	3: { min: 252, max: 386 },
	4: { min: 387, max: 493 },
	5: { min: 494, max: 649 },
	6: { min: 650, max: 721 },
	7: { min: 722, max: 809 },
	8: { min: 810, max: 898 },
};

export const ALL_GENS = [1, 2, 3, 4, 5, 6, 7, 8];

export function idToGen(id) {
	const n = Number(id);
	for (const g of ALL_GENS) {
		const r = GEN_RANGES[g];
		if (n >= r.min && n <= r.max) return g;
	}
	return null;
}

export function isInGens(id, gens) {
	if (!gens || gens.length === 0) return false;
	const g = idToGen(id);
	return g != null && gens.includes(g);
}

export function randomIdFromGens(gens) {
	const list = (gens && gens.length > 0 ? gens : ALL_GENS).slice().sort();
	const sizes = list.map((g) => {
		const r = GEN_RANGES[g];
		return r.max - r.min + 1;
	});
	const total = sizes.reduce((s, n) => s + n, 0);
	let rand = Math.floor(Math.random() * total);
	for (let i = 0; i < list.length; i++) {
		if (rand < sizes[i]) {
			return GEN_RANGES[list[i]].min + rand;
		}
		rand -= sizes[i];
	}
	return GEN_RANGES[list[list.length - 1]].max;
}
