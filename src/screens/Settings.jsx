import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { MODES, MODE_ORDER } from '../game/modes';
import { ALL_GENS } from '../game/gens';

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;
	const sa = [...a].sort();
	const sb = [...b].sort();
	return sa.every((v, i) => v === sb[i]);
}

export default function Settings({
	open,
	initialMode,
	initialGens,
	initialMuted,
	inGame,
	onApply,
	onGiveUp,
	onBackToMenu,
	onClose,
}) {
	const [mode, setMode] = useState(initialMode);
	const [gens, setGens] = useState(initialGens);
	const [muted, setMuted] = useState(initialMuted);

	useEffect(() => {
		if (open) {
			setMode(initialMode);
			setGens(initialGens);
			setMuted(initialMuted);
		}
	}, [open, initialMode, initialGens, initialMuted]);

	if (!open) return null;

	const toggleGen = (g) => {
		setGens((prev) => {
			if (prev.includes(g)) {
				const next = prev.filter((x) => x !== g);
				return next.length === 0 ? [g] : next;
			}
			return [...prev, g].sort();
		});
	};

	const allSelected = arraysEqual(gens, ALL_GENS);
	const dirty =
		mode !== initialMode ||
		!arraysEqual(gens, initialGens) ||
		muted !== initialMuted;

	const apply = () => onApply({ mode, gens, muted });

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(5,4,16,0.85)]"
			onClick={onClose}
		>
			<div
				className="w-full max-w-sm max-h-[92vh] bg-bg-deep border-[3px] border-accent rounded flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-4 py-3 border-b-2 border-line-soft">
					<h2 className="font-pixel text-sm text-accent tracking-[2px]">AJUSTES</h2>
					<button
						type="button"
						onClick={onClose}
						className="font-pixel text-base text-txt px-1"
					>
						✕
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-4 py-3.5">
					<p className="font-pixel text-[9px] text-accent-pink tracking-[2px] mb-2.5">
						MODO
					</p>
					<div className="flex gap-1.5">
						{MODE_ORDER.map((k) => {
							const m = MODES[k];
							const selected = mode === k;
							return (
								<button
									key={k}
									type="button"
									onClick={() => setMode(k)}
									className={clsx(
										'flex-1 py-3 px-1 border-2 border-b-4 rounded-sm flex flex-col items-center active:translate-y-0.5 active:border-b-2',
										selected
											? 'bg-accent text-bg-deep border-bg-deep'
											: 'bg-bg-card text-txt border-line-soft'
									)}
								>
									<span className="font-pixel text-[8px] tracking-[1px]">{m.label}</span>
									<span
										className={clsx(
											'font-mono text-lg mt-1',
											selected ? 'text-bg-deep' : 'text-txt-dim'
										)}
									>
										{m.sub}
									</span>
								</button>
							);
						})}
					</div>

					<p className="font-pixel text-[9px] text-accent-pink tracking-[2px] mt-5 mb-2.5">
						GERAÇÕES
					</p>
					<div className="flex flex-wrap gap-1.5">
						{ALL_GENS.map((g) => {
							const selected = gens.includes(g);
							return (
								<button
									key={g}
									type="button"
									onClick={() => toggleGen(g)}
									className={clsx(
										'w-[22%] aspect-[1.4] border-2 border-b-4 rounded-sm flex items-center justify-center active:translate-y-0.5 active:border-b-2',
										selected
											? 'bg-accent-mint text-bg-deep border-bg-deep'
											: 'bg-bg-card text-txt border-line-soft'
									)}
								>
									<span className="font-pixel text-sm">{g}</span>
								</button>
							);
						})}
					</div>
					<button
						type="button"
						onClick={() => setGens(allSelected ? [1] : [...ALL_GENS])}
						className={clsx(
							'w-full mt-2 py-2.5 border-2 border-b-4 rounded-sm font-pixel text-[10px] tracking-[2px] active:translate-y-0.5 active:border-b-2',
							allSelected
								? 'bg-accent-mint text-bg-deep border-bg-deep'
								: 'bg-bg-card text-txt border-line-soft'
						)}
					>
						{allSelected ? '✓ TODAS' : 'TODAS'}
					</button>

					<p className="font-pixel text-[9px] text-accent-pink tracking-[2px] mt-5 mb-2.5">
						SOM / VIBRAÇÃO
					</p>
					<button
						type="button"
						onClick={() => setMuted((v) => !v)}
						className={clsx(
							'w-full py-2.5 border-2 border-b-4 rounded-sm font-pixel text-[10px] tracking-[2px] active:translate-y-0.5 active:border-b-2',
							!muted
								? 'bg-accent-mint text-bg-deep border-bg-deep'
								: 'bg-bg-card text-txt border-line-soft'
						)}
					>
						{muted ? '✕ DESLIGADO' : '✓ LIGADO'}
					</button>

					{inGame && (
						<>
							<p className="font-pixel text-[9px] text-miss tracking-[2px] mt-5 mb-2.5">
								EM JOGO
							</p>
							<button
								type="button"
								onClick={onGiveUp}
								className="w-full py-3 mb-2 bg-miss text-white font-pixel text-[10px] tracking-[1px] border-2 border-b-4 border-bg-deep rounded-sm active:translate-y-0.5 active:border-b-2"
							>
								DESISTIR
							</button>
							<button
								type="button"
								onClick={onBackToMenu}
								className="w-full py-3 bg-bg-card text-txt border-2 border-b-4 border-line font-pixel text-[10px] tracking-[1px] rounded-sm active:translate-y-0.5 active:border-b-2"
							>
								VOLTAR AO MENU
							</button>
						</>
					)}
				</div>

				<div className="px-4 py-3 border-t-2 border-line-soft flex flex-col gap-2">
					{dirty && (
						<button
							type="button"
							onClick={apply}
							className="w-full py-3 bg-accent text-bg-deep font-pixel text-[10px] tracking-[1px] border-2 border-b-4 border-bg-deep rounded-sm active:translate-y-0.5 active:border-b-2"
						>
							{inGame ? 'APLICAR E REINICIAR' : 'APLICAR'}
						</button>
					)}
					<button
						type="button"
						onClick={onClose}
						className="w-full py-3 bg-bg-card text-txt border-2 border-b-4 border-line font-pixel text-[10px] tracking-[1px] rounded-sm active:translate-y-0.5 active:border-b-2"
					>
						{dirty ? 'CANCELAR' : 'FECHAR'}
					</button>
				</div>
			</div>
		</div>
	);
}
