import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { comparePokemons } from '../api/comparePoke';
import { hapticForKind } from '../game/feedback';

const KIND_LABELS = {
	match: 'OK',
	partial: 'PERTO',
	miss: 'X',
};

const KIND_CHIP_CLASSES = {
	match: 'guess-chip--match',
	partial: 'guess-chip--partial',
	miss: 'guess-chip--miss',
};

const KIND_STATUS_CLASSES = {
	match: 'guess-status-badge--match',
	partial: 'guess-status-badge--partial',
	miss: 'guess-status-badge--miss',
};

const CELL_LABELS = {
	geracao: 'GERACAO',
	evolucao: 'EVOLUCAO',
	cor: 'COR',
	habitat: 'HABITAT',
	altura: 'ALTURA',
	peso: 'PESO',
};

const TYPE_CLASSES = {
	Normal: 'bg-[#d9d2c5] text-[#1a1730]',
	Fogo: 'bg-[#ff884d] text-[#1a1730]',
	Agua: 'bg-[#55b7ff] text-[#07101c]',
	Eletrico: 'bg-accent text-bg-deep',
	Planta: 'bg-match text-bg-deep',
	Gelo: 'bg-[#8be8ff] text-[#07101c]',
	Lutador: 'bg-[#d96d56] text-white',
	Veneno: 'bg-accent-pink text-bg-deep',
	Terra: 'bg-[#d7a85c] text-bg-deep',
	Voador: 'bg-[#b8d3ff] text-bg-deep',
	Psiquico: 'bg-[#ff6bba] text-bg-deep',
	Inseto: 'bg-[#b9e65c] text-bg-deep',
	Pedra: 'bg-[#bba66f] text-bg-deep',
	Fantasma: 'bg-[#7564c9] text-white',
	Dragao: 'bg-[#7466ff] text-white',
	Sombrio: 'bg-[#594a65] text-white',
	Aco: 'bg-[#b9bfd7] text-bg-deep',
	Fada: 'bg-[#ff9bd3] text-bg-deep',
};

function normalizeTypeName(type) {
	return type
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace('ç', 'c')
		.replace('Ç', 'C');
}

function TypeBadge({ type }) {
	const normalized = normalizeTypeName(type);
	const className = TYPE_CLASSES[normalized] || 'bg-bg-cell text-txt';

	return (
		<span
			className={clsx(
				'inline-flex min-h-[18px] items-center border border-bg-deep px-2 py-1 font-pixel text-[8px] leading-none tracking-[0.5px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.16)]',
				className
			)}
		>
			{normalized.toUpperCase()}
		</span>
	);
}

function StatusBadge({ kind, animate, delay = 0 }) {
	const [revealed, setRevealed] = useState(!animate);

	useEffect(() => {
		if (!animate) {
			setRevealed(true);
			return undefined;
		}
		setRevealed(false);
		const t = setTimeout(() => {
			hapticForKind(kind);
			setRevealed(true);
		}, delay);
		return () => clearTimeout(t);
	}, [animate, delay, kind]);

	return (
		<span
			className={clsx(
				'guess-status-badge',
				KIND_STATUS_CLASSES[kind] || KIND_STATUS_CLASSES.miss,
				!revealed && 'guess-status-badge--hidden'
			)}
		>
			{KIND_LABELS[kind] || KIND_LABELS.miss} TIPO
		</span>
	);
}

function ResultChip({ cell, animate, delay }) {
	const [revealed, setRevealed] = useState(!animate);

	useEffect(() => {
		if (!animate) {
			setRevealed(true);
			return undefined;
		}
		setRevealed(false);
		const t = setTimeout(() => {
			hapticForKind(cell.kind);
			setRevealed(true);
		}, delay);
		return () => clearTimeout(t);
	}, [animate, delay, cell.kind]);

	return (
		<div
			className={clsx(
				'guess-chip',
				KIND_CHIP_CLASSES[cell.kind] || KIND_CHIP_CLASSES.miss,
				!revealed && 'guess-chip--hidden'
			)}
		>
			<span className="guess-chip__label">{CELL_LABELS[cell.col] || cell.col}</span>
			<span className="guess-chip__value">
				{cell.value}
				{cell.arrow ? ` ${cell.arrow}` : ''}
			</span>
		</div>
	);
}

function EmptyChip() {
	return (
		<div className="guess-chip guess-chip--empty">
			<span className="guess-chip__label">DICA</span>
			<span className="guess-chip__value">---</span>
		</div>
	);
}

export default function GuessRow({ index = 0, guess, target, animate, singleGenMode }) {
	const cells = useMemo(
		() => (guess ? comparePokemons(guess, target, { singleGenMode }) : []),
		[guess, target, singleGenMode]
	);

	if (!guess) {
		return (
			<article className="guess-card guess-card--empty" aria-label={`Palpite ${index + 1} vazio`}>
				<div className="guess-card__content">
					<div className="guess-sprite-medallion guess-sprite-medallion--empty">
						<span>?</span>
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-2">
							<div>
								<p className="font-pixel text-[11px] leading-5 text-txt-dim tracking-[1px]">
									PALPITE
								</p>
								<p className="font-pixel text-[10px] text-txt-faint tracking-[1px]">
									#{String(index + 1).padStart(2, '0')}
								</p>
							</div>
							<span className="guess-empty-slot">AGUARDANDO</span>
						</div>

						<div className="guess-card__divider" />

						<div className="guess-chip-grid">
							{Array.from({ length: 5 }).map((_, i) => (
								<EmptyChip key={i} />
							))}
						</div>
					</div>
				</div>
			</article>
		);
	}

	const typeCell = cells[0];
	const detailCells = cells.slice(1);
	const types = guess.tipos || [guess.tipo1, guess.tipo2].filter(Boolean);

	return (
		<article className="guess-card" aria-label={`Palpite ${guess.nome}`}>
			<div className="guess-card__content">
				<div className="guess-sprite-medallion">
					<img src={guess.sprite_pixel} alt={guess.nome} />
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<h3 className="font-pixel text-[14px] leading-6 text-accent tracking-[1px] truncate">
								{guess.nome.toUpperCase()}
							</h3>
							<p className="font-pixel text-[8px] text-line tracking-[1px]">
								#{String(guess.id || guess.key).padStart(3, '0')}
							</p>
						</div>
					</div>

					<div className="mt-2 flex flex-wrap items-center gap-1.5">
						{types.map((type) => (
							<TypeBadge key={type} type={type} />
						))}
						<StatusBadge kind={typeCell.kind} animate={animate} delay={120} />
					</div>

					<div className="guess-card__divider" />

					<div className="guess-chip-grid">
						{detailCells.map((cell, i) => (
							<ResultChip
								key={cell.col}
								cell={cell}
								animate={animate}
								delay={(i + 2) * 180}
							/>
						))}
					</div>
				</div>
			</div>
		</article>
	);
}
