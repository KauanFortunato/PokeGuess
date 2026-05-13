import clsx from 'clsx';
import { haptics } from '../game/feedback';

export default function InputRow({
	value,
	onChangeText,
	suggestions,
	onPickSuggestion,
	disabled,
}) {
	return (
		<div className="relative z-20">
			<div className="flex items-center gap-2 bg-bg-input border-2 border-line border-b-4 rounded-sm px-3 py-2">
				<span className="text-accent font-pixel text-sm animate-blink">▶</span>
				<input
					type="text"
					className="flex-1 bg-transparent border-0 outline-none text-txt font-pixel text-sm tracking-[1px] py-2 uppercase"
					placeholder="DIGITE O NOME..."
					value={value}
					onChange={(e) => onChangeText(e.target.value.toUpperCase())}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && suggestions?.[0]) {
							onPickSuggestion(suggestions[0]);
						}
					}}
					disabled={disabled}
					autoCapitalize="characters"
					autoCorrect="off"
					autoComplete="off"
					spellCheck="false"
				/>
			</div>

			{suggestions && suggestions.length > 0 && (
				<div className="absolute top-full left-0 right-0 mt-1 bg-bg-mid border-2 border-b-[3px] border-line rounded-sm z-30 overflow-hidden">
					{suggestions.map((s, idx) => (
						<button
							key={s.key || s._apiId || idx}
							type="button"
							onClick={() => {
								haptics.tap();
								onPickSuggestion(s);
							}}
							className={clsx(
								'w-full flex items-center gap-2.5 px-2.5 py-1.5 border-b border-line-soft text-left active:bg-bg-cell hover:bg-bg-cell transition-colors',
								idx === suggestions.length - 1 && 'border-b-0'
							)}
						>
							<img
								src={s.img_poke}
								alt={s.nome}
								className="w-8 h-8 object-contain flex-shrink-0"
							/>
							<span className="flex-1 text-txt font-pixel text-xs tracking-[1px] uppercase truncate">
								{s.nome}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
