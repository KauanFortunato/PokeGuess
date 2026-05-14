import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, RotateCcw, Skull } from 'lucide-react';
import { haptics } from '../game/feedback';
import { playCry } from '../game/sound';

function ResultStat({ label, value }) {
	return (
		<div className="result-stat result-stat--danger">
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

export default function Lose({ target, mode, challengeType, gaveUp, onAgain }) {
	useEffect(() => {
		haptics.error();
		const timer = setTimeout(() => playCry(target?.id), 400);
		return () => clearTimeout(timer);
	}, [target]);

	return (
		<div className="end-screen end-screen--lose">
			<div className="end-screen__shell">
				<motion.div
					initial={{ y: -12, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="end-screen__eyebrow end-screen__eyebrow--danger"
				>
					{gaveUp ? <Flag size={17} strokeWidth={2.8} /> : <Skull size={17} strokeWidth={2.8} />}
					<span>{gaveUp ? 'PARTIDA ENCERRADA' : 'SEM TENTATIVAS'}</span>
				</motion.div>

				<div className="end-screen__stage end-screen__stage--danger">
					<div className="end-screen__reveal-slot">
						<motion.div
							className="end-screen__reveal-item end-screen__pokemon-motion"
							initial={{ scale: 0.86, opacity: 0, y: 12 }}
							animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
							transition={{
								scale: { duration: 0.35 },
								opacity: { duration: 0.35 },
								y: { duration: 1.7, repeat: Infinity, ease: 'easeInOut' },
							}}
						>
							<PokemonReveal target={target} />
						</motion.div>
					</div>
				</div>

				<motion.div
					initial={{ y: 18, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.12, duration: 0.45 }}
					className="end-screen__content"
				>
					<motion.h2
						animate={{ x: [-4, 4, -4, 0] }}
						transition={{ duration: 0.4, times: [0.25, 0.5, 0.75, 1] }}
						className="end-screen__title end-screen__title--lose"
					>
						{gaveUp ? 'DESISTIU' : 'DERROTA'}
					</motion.h2>
					<p className="end-screen__caption">ERA</p>
					<p className="end-screen__name end-screen__name--danger">{target.nome}</p>

					<div className="result-stat-grid">
						<ResultStat label="TIPO" value={target.tipos.join('/')} />
						<ResultStat label="GER" value={target.geracao} />
						<ResultStat label="COR" value={target.cor} />
						<ResultStat label="HABITAT" value={target.habitat} />
					</div>

					{mode && (
						<p className="end-screen__mode end-screen__mode--danger">
							<Skull size={14} strokeWidth={2.8} />
							{challengeType === 'daily' ? 'POKÉMON DO DIA' : `MODO ${mode.label}`}
						</p>
					)}

					<button type="button" onClick={onAgain} className="pixel-action-button pixel-action-button--danger">
						<RotateCcw size={16} strokeWidth={2.8} />
						<span>TENTAR DE NOVO</span>
					</button>
				</motion.div>
			</div>
		</div>
	);
}
