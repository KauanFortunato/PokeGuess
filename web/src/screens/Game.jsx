import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FilterPoke } from '../api/filterPoke';
import { fetchPokemonData } from '../api/pokeApiService';
import { haptics } from '../game/feedback';
import Board from '../components/Board';
import InputRow from '../components/InputRow';

const FLIP_ANIM_DURATION = 6 * 180 + 500;
const HINT_THRESHOLD = 10;

function buildHintOrder(singleGenMode) {
	return [
		singleGenMode
			? { key: 'evolucao', label: 'EVO' }
			: { key: 'geracao', label: 'GERAÇÃO' },
		{ key: 'tipos', label: 'TIPO' },
		{ key: 'cor', label: 'COR' },
		{ key: 'habitat', label: 'HABITAT' },
	];
}

function getHintValue(target, key) {
	if (key === 'tipos') return (target.tipos || []).join('/');
	if (key === 'evolucao') return `Estágio ${target.evolucao ?? 1}`;
	if (key === 'geracao') return `${target.geracao}`;
	return target[key] || '';
}

export default function Game({ target, mode, gens, onWin, onLose, onOpenSettings }) {
	const [term, setTerm] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [guesses, setGuesses] = useState([]);
	const [animatingIndex, setAnimatingIndex] = useState(-1);
	const [busy, setBusy] = useState(false);
	const [revealedHints, setRevealedHints] = useState([]);

	const maxGuesses = mode?.maxGuesses ?? Infinity;
	const isInfinite = !Number.isFinite(maxGuesses);
	const hintsAllowed = mode?.key !== 'nightmare';
	const singleGenMode = Array.isArray(gens) && gens.length === 1;
	const hintOrder = useMemo(() => buildHintOrder(singleGenMode), [singleGenMode]);
	const canHint =
		hintsAllowed &&
		guesses.length >= HINT_THRESHOLD &&
		revealedHints.length < hintOrder.length;

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			if (!term) {
				setSuggestions([]);
				return;
			}
			const guessedKeys = new Set(guesses.map((g) => g.key));
			await FilterPoke(
				term,
				(items) => {
					if (cancelled) return;
					setSuggestions(items.filter((p) => !guessedKeys.has(p.key)).slice(0, 5));
				},
				gens
			);
		};
		run();
		return () => {
			cancelled = true;
		};
	}, [term, guesses, gens]);

	const submit = async (suggestion) => {
		if (busy) return;
		setBusy(true);
		setTerm('');
		setSuggestions([]);
		haptics.medium();
		try {
			const full = await fetchPokemonData(suggestion._apiId || suggestion.key);
			const nextGuesses = [...guesses, full];
			const idx = nextGuesses.length - 1;
			setGuesses(nextGuesses);
			setAnimatingIndex(idx);

			setTimeout(() => {
				setAnimatingIndex(-1);
				setBusy(false);
				if (full.key === target.key) {
					onWin(nextGuesses);
				} else if (!isInfinite && nextGuesses.length >= maxGuesses) {
					onLose(nextGuesses);
				}
			}, FLIP_ANIM_DURATION);
		} catch (err) {
			console.error('Erro ao submeter palpite:', err);
			setBusy(false);
		}
	};

	const revealHint = () => {
		if (!canHint) return;
		haptics.light();
		setRevealedHints((prev) => {
			const nextKey = hintOrder[prev.length].key;
			return [...prev, nextKey];
		});
	};

	const baseHint = useMemo(() => {
		if (isInfinite) {
			return guesses.length === 0
				? 'Modo infinito — boa sorte!'
				: 'Use as dicas das colunas...';
		}
		const remaining = maxGuesses - guesses.length;
		if (guesses.length === 0) return 'Comece com qualquer criatura';
		if (guesses.length === 1) return 'Use as dicas das colunas...';
		if (guesses.length === 2)
			return 'Verde = certo, Amarelo = perto, Vermelho = errado';
		if (remaining === 1) return 'ÚLTIMA CHANCE!';
		return `${remaining} tentativas restantes`;
	}, [guesses.length, isInfinite, maxGuesses]);

	const remainingHints = hintOrder.length - revealedHints.length;
	const hintActive = canHint || revealedHints.length > 0;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.96 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4 }}
			className="flex-1 flex flex-col safe-top safe-bottom bg-bg-deep items-center"
		>
		<div className="w-full max-w-[640px] flex-1 flex flex-col px-2.5 pt-2 pb-2">
			<div className="flex items-center justify-between px-1 pb-2.5 border-b-2 border-line-soft gap-2">
				<button
					type="button"
					onClick={() => {
						haptics.tap();
						onOpenSettings();
					}}
					className="w-9 h-9 bg-bg-card border-2 border-b-[3px] border-line-soft rounded-sm flex items-center justify-center font-pixel text-base text-txt active:translate-y-px active:border-b-2"
				>
					⌗
				</button>

				<div className="flex-1 text-center">
					<div className="flex justify-center">
						<span className="font-pixel text-base tracking-[1px] text-txt">POKE</span>
						<span className="font-pixel text-base tracking-[1px] text-accent ml-0.5">
							GUESS
						</span>
					</div>
					<p className="font-mono text-base text-txt-dim tracking-[2px] mt-1">
						CHUTES: {guesses.length}
						{isInfinite ? '' : `/${maxGuesses}`}
					</p>
				</div>

				<div className="min-w-9 h-9 bg-bg-card border-2 border-b-[3px] border-accent rounded-sm flex items-center justify-center px-1.5">
					<span className="font-pixel text-xs text-accent">{mode?.sub ?? '∞'}</span>
				</div>
			</div>

			{hintActive ? (
				<button
					type="button"
					onClick={revealHint}
					disabled={!canHint}
					className={clsx(
						'mt-2 px-2.5 py-2 bg-bg-card border-2 border-accent rounded-sm flex items-center gap-2.5 min-h-11 text-left',
						canHint && 'active:bg-bg-cell shadow-[0_0_10px_rgba(255,210,63,0.4)]'
					)}
				>
					<span className="px-1.5 py-1 bg-bg-deep border border-accent rounded-sm font-pixel text-[9px] text-accent tracking-[1px]">
						★ DICA
					</span>
					<div className="flex-1">
						{revealedHints.length === 0 ? (
							<span className="font-pixel text-[10px] text-accent tracking-[1px]">
								▶ TOCAR PARA REVELAR
							</span>
						) : (
							revealedHints.map((k) => {
								const info = hintOrder.find((h) => h.key === k);
								return (
									<p key={k} className="font-mono text-base leading-tight">
										<span className="font-pixel text-[8px] text-accent-pink tracking-[1px]">
											{info.label}:{' '}
										</span>
										<span className="text-txt">{getHintValue(target, k)}</span>
									</p>
								);
							})
						)}
					</div>
					{canHint && (
						<span className="bg-accent border border-bg-deep border-b-2 px-1.5 py-1 rounded-sm min-w-7 text-center font-pixel text-[10px] text-bg-deep tracking-[1px]">
							+{remainingHints}
						</span>
					)}
				</button>
			) : (
				<div className="mt-2 px-2.5 py-1.5 bg-bg-mid border border-line-soft rounded-sm flex items-center gap-2.5 min-h-11">
					<span className="px-1.5 py-1 bg-bg-deep border border-accent rounded-sm font-pixel text-[9px] text-accent tracking-[1px]">
						DICA
					</span>
					<p className="flex-1 text-txt font-mono text-base">{baseHint}</p>
				</div>
			)}

			<div className="mt-2.5 relative z-20">
				<InputRow
					value={term}
					onChangeText={setTerm}
					suggestions={suggestions}
					onPickSuggestion={submit}
					disabled={busy}
				/>
			</div>

			<div className="flex-1 mt-2 overflow-y-auto pb-2">
				<Board
					guesses={guesses}
					target={target}
					animatingIndex={animatingIndex}
					maxGuesses={maxGuesses}
					singleGenMode={singleGenMode}
				/>
			</div>
			</div>
		</motion.div>
	);
}
