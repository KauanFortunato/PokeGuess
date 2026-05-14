import assert from 'node:assert/strict';
import test from 'node:test';
import { getDailyDateKey, getDailyPokemonId } from './dailyPoke.js';

test('getDailyDateKey uses the UTC calendar day', () => {
	const date = new Date('2026-05-14T23:58:00-03:00');

	assert.equal(getDailyDateKey(date), '2026-05-15');
});

test('getDailyPokemonId is deterministic and stays inside the PokeGuess range', () => {
	const idA = getDailyPokemonId('2026-05-14');
	const idB = getDailyPokemonId('2026-05-14');
	const idC = getDailyPokemonId('2026-05-15');

	assert.equal(idA, idB);
	assert.notEqual(idA, idC);
	assert.equal(Number.isInteger(idA), true);
	assert.equal(idA >= 1 && idA <= 898, true);
});
