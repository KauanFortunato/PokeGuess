import assert from 'node:assert/strict';
import test from 'node:test';
import {
	formatReminderTime,
	normalizeReminderSettings,
	parseReminderTime,
} from './notifications.js';

test('parseReminderTime reads valid HH:MM strings', () => {
	assert.deepEqual(parseReminderTime('07:35'), { hour: 7, minute: 35 });
});

test('parseReminderTime falls back for invalid values', () => {
	assert.deepEqual(parseReminderTime('bad-value'), { hour: 19, minute: 0 });
});

test('formatReminderTime pads values to HH:MM', () => {
	assert.equal(formatReminderTime(7, 5), '07:05');
});

test('normalizeReminderSettings clamps invalid values and keeps defaults', () => {
	const normalized = normalizeReminderSettings({
		enabled: true,
		hour: 44,
		minute: -9,
		lastPermissionStatus: 'granted',
	});

	assert.equal(normalized.enabled, true);
	assert.equal(normalized.hour, 23);
	assert.equal(normalized.minute, 0);
	assert.equal(normalized.lastPermissionStatus, 'granted');
});
