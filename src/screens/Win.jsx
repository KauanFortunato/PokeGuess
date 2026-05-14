import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { haptics } from '../game/feedback';
import { playCry } from '../game/sound';

const CONFETTI_COLORS = ['#ffd23f', '#ff6b9d', '#7fffd4', '#94e344', '#41a6f6', '#ef7d57'];

function CaptureDisc() {
	return (
		<motion.div
			initial={{ rotate: 0, scale: 0.72, opacity: 0 }}
			animate={{ rotate: 540, scale: 1, opacity: 1 }}
			exit={{ scale: 2.4, opacity: 0 }}
			transition={{ duration: 0.8, ease: 'linear' }}
			className="end-screen__capture-disc"
		>
			<div className="end-screen__capture-disc-top" />
			<div className="end-screen__capture-disc-line" />
			<div className="end-screen__capture-disc-core" />
		</motion.div>
	);
}

function Confetti() {
	const pieces = useMemo(
		() =>
			Array.from({ length: 36 }, (_, i) => ({
				id: i,
				left: `${Math.random() * 95}%`,
				color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
				size: 4 + Math.floor(Math.random() * 3) * 2,
				delay: Math.random() * 0.6,
				dur: 1.4 + Math.random() * 1.2,
				drift: `${(Math.random() - 0.5) * 80}px`,
			})),
		[]
	);

	return (
		<div className="absolute inset-0 pointer-events-none z-10">
			{pieces.map((p) => (
				<div
					key={p.id}
					className="absolute top-0 animate-confetti"
					style={{
						left: p.left,
						background: p.color,
						width: p.size,
						height: p.size,
						animationDuration: `${p.dur}s`,
						animationDelay: `${p.delay}s`,
						'--drift': p.drift,
					}}
				/>
			))}
		</div>
	);
}

function ResultStat({ label, value }) {
	return (
		<div className="result-stat">
			<span className="result-stat__label">{label}</span>
			<span className="result-stat__value">{value}</span>
		</div>
	);
}

function PokemonReveal({ target }) {
	return (
		<div className="end-screen__pokemon-stack">
			<img
				src={target.sprite_pixel}
				alt=""
				className="end-screen__pokemon-pixel"
				aria-hidden="true"
			/>
			<img src={target.img_poke} alt={target.nome} className="end-screen__pokemon" />
		</div>
	);
}

export default function Win({ target, guesses, mode, challengeType, onAgain }) {
	const [stage, setStage] = useState(0);

	useEffect(() => {
		haptics.medium();
		const t1 = setTimeout(() => {
			setStage(1);
			haptics.light();
		}, 800);
		const t2 = setTimeout(() => {
			setStage(2);
			playCry(target?.id);
		}, 1400);
		const t3 = setTimeout(() => {
			setStage(3);
			haptics.success();
		}, 1700);
		return () => [t1, t2, t3].forEach(clearTimeout);
	}, [target]);

	return (
		<div className="end-screen end-screen--win">
			{stage >= 3 && <Confetti />}

			<div className="end-screen__shell">
				<motion.div
					initial={{ y: -12, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="end-screen__eyebrow"
				>
					<Trophy size={17} strokeWidth={2.8} />
					<span>CAPTURA CONFIRMADA</span>
				</motion.div>

				<div className="end-screen__stage">
					<div className="end-screen__reveal-slot">
						<AnimatePresence mode="wait">
							{stage < 2 ? (
								<motion.div
									key="disc"
									className="end-screen__reveal-item"
									exit={{ scale: 2.4, opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<CaptureDisc />
								</motion.div>
							) : (
								<motion.div
									key="pokemon"
									className="end-screen__reveal-item end-screen__pokemon-motion"
									initial={{ scale: 0, opacity: 0, y: 20 }}
									animate={{ scale: 1, opacity: 1, y: 0 }}
									transition={{ type: 'spring', stiffness: 180, damping: 12 }}
								>
									<PokemonReveal target={target} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				<AnimatePresence>
					{stage >= 3 && (
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.15, duration: 0.45 }}
							className="end-screen__content"
						>
							<h2 className="end-screen__title end-screen__title--win">VITÓRIA</h2>
							<p className="end-screen__name">{target.nome}</p>

							<div className="result-stat-grid">
								<ResultStat label="CHUTES" value={guesses.length} />
								<ResultStat label="TIPO" value={target.tipos.join('/')} />
								<ResultStat label="GER" value={target.geracao} />
								<ResultStat label="COR" value={target.cor} />
							</div>

							{mode && (
								<p className="end-screen__mode">
									<Sparkles size={14} strokeWidth={2.8} />
									{challengeType === 'daily' ? 'POKÉMON DO DIA' : `MODO ${mode.label}`}
								</p>
							)}

							<button type="button" onClick={onAgain} className="pixel-action-button">
								<RotateCcw size={16} strokeWidth={2.8} />
								<span>JOGAR DE NOVO</span>
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
