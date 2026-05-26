import assert from 'node:assert/strict';
import test from 'node:test';
import {
	applyDailyProgressEntry,
	createInitialDailyProgress,
	getPreviousUtcDateKey,
	shouldTrackDailyProgress,
} from './dailyProgress.js';

test('getPreviousUtcDateKey returns the previous day in UTC', () => {
	assert.equal(getPreviousUtcDateKey('2026-05-26'), '2026-05-25');
});

test('daily progress keeps the first final result for the same day', () => {
	let progress = createInitialDailyProgress();

	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-26',
		status: 'in_progress',
		attemptsUsed: 2,
		pokemonId: 25,
	});
	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-26',
		status: 'won',
		attemptsUsed: 4,
		pokemonId: 25,
	});
	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-26',
		status: 'lost',
		attemptsUsed: 7,
		pokemonId: 25,
	});

	assert.equal(progress.entries['2026-05-26'].status, 'won');
	assert.equal(progress.entries['2026-05-26'].attemptsUsed, 4);
	assert.equal(progress.streak.current, 1);
	assert.equal(progress.streak.best, 1);
});

test('streak increments only across consecutive winning days', () => {
	let progress = createInitialDailyProgress();

	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-24',
		status: 'won',
		attemptsUsed: 3,
		pokemonId: 7,
	});
	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-25',
		status: 'won',
		attemptsUsed: 2,
		pokemonId: 8,
	});
	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-27',
		status: 'won',
		attemptsUsed: 5,
		pokemonId: 9,
	});

	assert.equal(progress.streak.current, 1);
	assert.equal(progress.streak.best, 2);
	assert.equal(progress.streak.lastWinDateKey, '2026-05-27');
});

test('losing a daily challenge resets current streak but keeps best streak', () => {
	let progress = createInitialDailyProgress();

	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-24',
		status: 'won',
		attemptsUsed: 1,
		pokemonId: 132,
	});
	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-25',
		status: 'won',
		attemptsUsed: 1,
		pokemonId: 133,
	});
	progress = applyDailyProgressEntry(progress, {
		dateKey: '2026-05-26',
		status: 'lost',
		attemptsUsed: 6,
		pokemonId: 134,
	});

	assert.equal(progress.streak.current, 0);
	assert.equal(progress.streak.best, 2);
});

test('daily progress tracking does not include non-daily challenge types', () => {
	assert.equal(shouldTrackDailyProgress('daily'), true);
	assert.equal(shouldTrackDailyProgress('random'), false);
	assert.equal(shouldTrackDailyProgress('classic'), false);
});
