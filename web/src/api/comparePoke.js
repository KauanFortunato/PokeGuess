// Returns 6 cells matching the active column layout.
// When singleGenMode is true, the "GER" column is replaced with "EVO" (evolution stage).
export const comparePokemons = (guess, target, options = {}) => {
	const { singleGenMode = false } = options;
	const gTypes = guess.tipos || [guess.tipo1, guess.tipo2].filter(Boolean);
	const tTypes = target.tipos || [target.tipo1, target.tipo2].filter(Boolean);

	const sameSet =
		gTypes.length === tTypes.length && gTypes.every((t) => tTypes.includes(t));
	const overlap = gTypes.some((t) => tTypes.includes(t));
	const typeKind = sameSet ? 'match' : overlap ? 'partial' : 'miss';

	let middleCell;
	if (singleGenMode) {
		const gEvo = guess.evolucao || 1;
		const tEvo = target.evolucao || 1;
		const diff = tEvo - gEvo;
		const abs = Math.abs(diff);
		const kind = abs === 0 ? 'match' : abs === 1 ? 'partial' : 'miss';
		const arrow = diff === 0 ? '' : diff > 0 ? '↑' : '↓';
		middleCell = { col: 'evolucao', kind, value: `E${gEvo}`, arrow };
	} else {
		const diff = target.geracao - guess.geracao;
		const abs = Math.abs(diff);
		const kind = diff === 0 ? 'match' : abs === 1 ? 'partial' : 'miss';
		const arrow = diff === 0 ? '' : diff > 0 ? '↑' : '↓';
		middleCell = { col: 'geracao', kind, value: `G${guess.geracao}`, arrow };
	}

	const colorKind = guess.cor === target.cor ? 'match' : 'miss';
	const habKind = guess.habitat === target.habitat ? 'match' : 'miss';

	const hDiff = target.alturaM - guess.alturaM;
	const hAbs = Math.abs(hDiff);
	const hKind = hAbs < 0.05 ? 'match' : hAbs <= 0.3 ? 'partial' : 'miss';
	const hArrow = hAbs < 0.05 ? '' : hDiff > 0 ? '↑' : '↓';

	const wDiff = target.pesoKg - guess.pesoKg;
	const wAbs = Math.abs(wDiff);
	const wKind = wAbs < 0.5 ? 'match' : wAbs <= 8 ? 'partial' : 'miss';
	const wArrow = wAbs < 0.5 ? '' : wDiff > 0 ? '↑' : '↓';

	return [
		{ col: 'tipos', kind: typeKind, value: gTypes.join('/') },
		middleCell,
		{ col: 'cor', kind: colorKind, value: guess.cor },
		{ col: 'habitat', kind: habKind, value: guess.habitat },
		{ col: 'altura', kind: hKind, value: `${guess.alturaM.toFixed(1)}m`, arrow: hArrow },
		{ col: 'peso', kind: wKind, value: `${guess.pesoKg.toFixed(1)}kg`, arrow: wArrow },
	];
};
