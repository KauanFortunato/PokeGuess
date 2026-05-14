import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBoardSlots } from './boardSlots.js';

test('buildBoardSlots displays newest guesses first and keeps empty slots after them', () => {
	const guesses = [{ key: '1' }, { key: '4' }, { key: '25' }];

	const slots = buildBoardSlots({
		guesses,
		maxGuesses: 6,
		animatingIndex: 2,
	});

	assert.deepEqual(
		slots.map((slot) => slot.guess?.key ?? null),
		['25', '4', '1', null, null, null]
	);
	assert.equal(slots[0].animate, true);
	assert.equal(slots[1].animate, false);
	assert.equal(slots[3].index, 3);
});
