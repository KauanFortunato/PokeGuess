export function buildBoardSlots({ guesses, maxGuesses, animatingIndex }) {
	const total = Number.isFinite(maxGuesses)
		? maxGuesses
		: Math.max(guesses.length + 1, 6);

	const newestFirst = guesses.map((guess, index) => ({ guess, originalIndex: index })).reverse();

	return Array.from({ length: total }, (_, index) => {
		const filled = newestFirst[index];

		if (!filled) {
			return {
				key: `empty-${index}`,
				index,
				guess: null,
				animate: false,
			};
		}

		return {
			key: `guess-${filled.guess.key || filled.originalIndex}-${filled.originalIndex}`,
			index: filled.originalIndex,
			guess: filled.guess,
			animate: filled.originalIndex === animatingIndex,
		};
	});
}
