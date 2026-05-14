import GuessRow from './GuessRow';
import { buildBoardSlots } from './boardSlots';

export default function Board({ guesses, target, animatingIndex, maxGuesses, singleGenMode }) {
	const slots = buildBoardSlots({ guesses, maxGuesses, animatingIndex });

	return (
		<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
			{slots.map((slot) => (
				<GuessRow
					key={slot.key}
					index={slot.index}
					guess={slot.guess}
					target={target}
					animate={slot.animate}
					singleGenMode={singleGenMode}
				/>
			))}
		</div>
	);
}
