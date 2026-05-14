import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('end screens use a fixed viewport shell without page scroll', () => {
	const cssSource = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
	const loseSource = readFileSync(new URL('./Lose.jsx', import.meta.url), 'utf8');

	assert.match(cssSource, /\.end-screen\s*{[^}]*height:\s*100dvh/s);
	assert.match(cssSource, /\.end-screen\s*{[^}]*overflow:\s*hidden/s);
	assert.match(cssSource, /\.end-screen__shell\s*{[^}]*max-height:\s*100%/s);
	assert.match(cssSource, /\.end-screen__stage\s*{[^}]*height:\s*clamp/s);
	assert.match(cssSource, /\.end-screen__reveal-slot\s*{[^}]*height:\s*min\(/s);
	assert.match(loseSource, /end-screen__reveal-slot/);
	assert.match(loseSource, /end-screen__reveal-item/);
});
