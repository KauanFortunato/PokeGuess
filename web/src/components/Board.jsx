import GuessRow, { SPRITE_CELL_WIDTH } from './GuessRow';

export default function Board({ guesses, target, animatingIndex, maxGuesses, singleGenMode }) {
	const total = Number.isFinite(maxGuesses)
		? maxGuesses
		: Math.max(guesses.length + 1, 6);

	const headers = ['TIPO', singleGenMode ? 'EVO' : 'GER', 'COR', 'HABITAT', 'ALT', 'PESO'];

	return (
		<div className="mt-2">
			<div className="flex gap-[3px] mb-1.5 pb-1">
				<div
					className="flex justify-center"
					style={{ width: SPRITE_CELL_WIDTH }}
				>
					<span className="font-pixel text-[7px] text-txt-dim tracking-[1px] py-1 pl-1 text-left w-full truncate">
						CRIATURA
					</span>
				</div>
				{headers.map((h) => (
					<div key={h} className="flex-1 flex items-center justify-center">
						<span className="font-pixel text-[7px] text-txt-dim tracking-[1px] py-1 text-center truncate">
							{h}
						</span>
					</div>
				))}
			</div>

			{Array.from({ length: total }).map((_, i) => (
				<GuessRow
					key={i}
					guess={guesses[i]}
					target={target}
					animate={i === animatingIndex}
					singleGenMode={singleGenMode}
				/>
			))}
		</div>
	);
}
