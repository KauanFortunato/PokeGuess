import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
	Check,
	Flag,
	Gamepad2,
	Home,
	Layers,
	RotateCcw,
	Shield,
	Skull,
	SlidersHorizontal,
	Target,
	Volume2,
	VolumeX,
	X,
} from 'lucide-react';
import { MODES, MODE_ORDER } from '../game/modes';
import { ALL_GENS } from '../game/gens';

const MODE_ICONS = {
	normal: Shield,
	hard: Target,
	nightmare: Skull,
};

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
	const SoundIcon = muted ? VolumeX : Volume2;

	return (
		<div className="settings-overlay" onClick={onClose}>
			<div className="settings-panel" onClick={(e) => e.stopPropagation()}>
				<div className="settings-header">
					<div className="flex min-w-0 items-center gap-2.5">
						<span className="settings-header__icon">
							<SlidersHorizontal size={18} strokeWidth={2.6} />
						</span>
						<div className="min-w-0">
							<h2 className="font-pixel text-sm text-accent tracking-[2px]">AJUSTES</h2>
							<p className="font-mono text-base leading-none text-txt-dim">
								modo, gerações e som
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="pixel-icon-button pixel-icon-button--small"
						aria-label="Fechar ajustes"
					>
						<X size={17} strokeWidth={2.8} />
					</button>
				</div>

				<div className="settings-body">
					<section className="settings-section">
						<div className="settings-section__title">
							<Gamepad2 size={15} strokeWidth={2.6} />
							<span>MODO</span>
						</div>
						<div className="settings-mode-grid">
							{MODE_ORDER.map((k) => {
								const m = MODES[k];
								const selected = mode === k;
								const ModeIcon = MODE_ICONS[k] || Gamepad2;
								return (
									<button
										key={k}
										type="button"
										onClick={() => setMode(k)}
										aria-pressed={selected}
										className={clsx('settings-choice', selected && 'settings-choice--selected')}
									>
										<span className="settings-choice__icon">
											<ModeIcon size={17} strokeWidth={2.7} />
										</span>
										<span className="settings-choice__label">{m.label}</span>
										<span className="settings-choice__sub">{m.description}</span>
									</button>
								);
							})}
						</div>
					</section>

					<section className="settings-section">
						<div className="settings-section__title">
							<Layers size={15} strokeWidth={2.6} />
							<span>GERAÇÕES</span>
						</div>
						<div className="settings-gen-grid">
							{ALL_GENS.map((g) => {
								const selected = gens.includes(g);
								return (
									<button
										key={g}
										type="button"
										onClick={() => toggleGen(g)}
										aria-pressed={selected}
										className={clsx('settings-gen', selected && 'settings-gen--selected')}
									>
										{selected && <Check size={12} strokeWidth={3} />}
										<span>{g}</span>
									</button>
								);
							})}
						</div>
						<button
							type="button"
							onClick={() => setGens(allSelected ? [1] : [...ALL_GENS])}
							className={clsx('settings-toggle', allSelected && 'settings-toggle--active')}
						>
							<Layers size={15} strokeWidth={2.7} />
							<span>{allSelected ? 'TODAS ATIVAS' : 'ATIVAR TODAS'}</span>
						</button>
					</section>

					<section className="settings-section">
						<div className="settings-section__title">
							<SoundIcon size={15} strokeWidth={2.6} />
							<span>SOM / VIBRAÇÃO</span>
						</div>
						<button
							type="button"
							onClick={() => setMuted((v) => !v)}
							aria-pressed={!muted}
							className={clsx('settings-toggle', !muted && 'settings-toggle--active')}
						>
							<SoundIcon size={17} strokeWidth={2.7} />
							<span>{muted ? 'DESLIGADO' : 'LIGADO'}</span>
						</button>
					</section>

					{inGame && (
						<section className="settings-section settings-section--danger">
							<div className="settings-section__title">
								<Flag size={15} strokeWidth={2.6} />
								<span>EM JOGO</span>
							</div>
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
								<button
									type="button"
									onClick={onGiveUp}
									className="settings-command settings-command--danger"
								>
									<Flag size={16} strokeWidth={2.7} />
									<span>DESISTIR</span>
								</button>
								<button
									type="button"
									onClick={onBackToMenu}
									className="settings-command"
								>
									<Home size={16} strokeWidth={2.7} />
									<span>MENU</span>
								</button>
							</div>
						</section>
					)}
				</div>

				<div className="settings-footer">
					{dirty && (
						<button type="button" onClick={apply} className="pixel-action-button">
							<RotateCcw size={16} strokeWidth={2.8} />
							<span>{inGame ? 'APLICAR E REINICIAR' : 'APLICAR'}</span>
						</button>
					)}
					<button
						type="button"
						onClick={onClose}
						className="pixel-action-button pixel-action-button--secondary"
					>
						<X size={16} strokeWidth={2.8} />
						<span>{dirty ? 'CANCELAR' : 'FECHAR'}</span>
					</button>
				</div>
			</div>
		</div>
	);
}
