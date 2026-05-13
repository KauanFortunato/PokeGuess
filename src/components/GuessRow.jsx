import { comparePokemons } from '../api/comparePoke';
import FlipCell from './FlipCell';

export const SPRITE_CELL_WIDTH = 48;

export default function GuessRow({ guess, target, animate, singleGenMode }) {
	if (!guess) {
		return (
			<div className="flex gap-[3px] mb-[3px]">
				<div
					className="h-11 rounded-sm border-[1.5px] border-dashed border-line-soft flex items-center justify-center pt-1"
					style={{ width: SPRITE_CELL_WIDTH }}
				>
					<span className="font-pixel text-xs text-txt-faint mt-3">?</span>
				</div>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="flex-1 h-11 rounded-sm border-[1.5px] border-dashed border-line-soft flex items-center justify-center"
					>
						<span className="font-pixel text-xs text-txt-faint">–</span>
					</div>
				))}
			</div>
		);
	}

	const cells = comparePokemons(guess, target, { singleGenMode });

	return (
		<div className="flex gap-[3px] mb-[3px]">
			<div
				className="h-11 rounded-sm border-[1.5px] border-line bg-bg-mid flex flex-col items-center justify-start pt-0.5 px-0.5"
				style={{ width: SPRITE_CELL_WIDTH }}
			>
				<img
					src={guess.sprite_pixel}
					alt={guess.nome}
					className="w-[26px] h-[26px] object-contain"
				/>
				<span className="font-pixel text-[6px] text-txt mt-0.5 w-full text-center truncate">
					{(guess.nome || '').toUpperCase()}
				</span>
			</div>
			{cells.map((c, i) => (
				<FlipCell key={i} cell={c} delay={(i + 1) * 180} animate={animate} />
			))}
		</div>
	);
}
