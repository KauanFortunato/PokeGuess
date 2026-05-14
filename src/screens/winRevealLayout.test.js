import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('victory reveal uses a fixed centered slot for disc and pokemon', () => {
	const winSource = readFileSync(new URL('./Win.jsx', import.meta.url), 'utf8');
	const cssSource = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

	assert.match(winSource, /end-screen__reveal-slot/);
	assert.match(winSource, /end-screen__reveal-item/);
	assert.match(cssSource, /\.end-screen__reveal-slot/);
	assert.match(cssSource, /\.end-screen__reveal-item/);
});
