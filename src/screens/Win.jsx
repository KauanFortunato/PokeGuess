import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptics } from '../game/feedback';
import { playCry } from '../game/sound';

const CONFETTI_COLORS = ['#ffd23f', '#ff6b9d', '#7fffd4', '#94e344', '#41a6f6', '#ef7d57'];

function Orb() {
	return (
		<motion.div
			initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
			animate={{ rotate: 540, scale: 1, opacity: 1 }}
			exit={{ scale: 3, opacity: 0 }}
			transition={{ duration: 0.8, ease: 'linear' }}
			className="relative w-[120px] h-[120px]"
			style={{ filter: 'drop-shadow(0 0 24px rgba(255,210,63,0.5))' }}
		>
			<div
				className="absolute inset-0 rounded-full border-4 border-bg-deep"
				style={{
					background:
						'radial-gradient(circle at 35% 35%, #ffd23f 0%, #e89c1d 50%, #a85f0a 100%)',
					boxShadow: 'inset 0 0 30px rgba(255,255,255,0.4), inset 0 -10px 0 rgba(0,0,0,0.2)',
				}}
			/>
			<div className="absolute left-0 right-0 top-[54px] h-3 bg-bg-deep" />
			<div className="absolute top-[42px] left-[42px] w-9 h-9 rounded-full bg-bg-deep flex items-center justify-center">
				<div className="w-4 h-4 rounded-full bg-white" />
			</div>
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

export default function Win({ target, guesses, mode, onAgain }) {
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
		<div className="relative flex-1 flex flex-col items-center justify-center gap-4 p-5 bg-gradient-radial from-[#2a1c5a] to-bg-deep safe-top safe-bottom"
			style={{ background: 'radial-gradient(ellipse at center, #2a1c5a 0%, #0c0a1a 80%)' }}>
			{stage >= 3 && <Confetti />}

			<div className="flex items-center justify-center min-h-[240px]">
				<AnimatePresence>
					{stage < 2 && (
						<motion.div key="orb" exit={{ scale: 3, opacity: 0 }} transition={{ duration: 0.5 }}>
							<Orb />
						</motion.div>
					)}
					{stage >= 2 && (
						<motion.img
							key="creature"
							src={target.img_poke}
							alt={target.nome}
							className="w-56 h-56 object-contain"
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ type: 'spring', stiffness: 200, damping: 12 }}
						/>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{stage >= 3 && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="text-center"
					>
						<h2
							className="font-pixel text-3xl text-accent tracking-[3px]"
							style={{ textShadow: '4px 4px 0 #0c0a1a, 0 0 12px rgba(255,210,63,0.5)' }}
						>
							VITÓRIA!
						</h2>
						<p className="font-mono text-2xl text-txt mt-3 tracking-[1px]">
							É <span className="font-pixel text-base text-accent-pink tracking-[2px]">{target.nome}</span>!
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{stage >= 3 && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="flex gap-3.5"
					>
						<div className="flex flex-col items-center gap-0.5">
							<span className="font-pixel text-[6px] text-txt-dim tracking-[1px]">TENTATIVAS</span>
							<span className="font-mono text-2xl text-accent">{guesses.length}</span>
						</div>
						<div className="flex flex-col items-center gap-0.5">
							<span className="font-pixel text-[6px] text-txt-dim tracking-[1px]">TIPO</span>
							<span className="font-mono text-2xl text-accent">{target.tipos.join('/')}</span>
						</div>
						<div className="flex flex-col items-center gap-0.5">
							<span className="font-pixel text-[6px] text-txt-dim tracking-[1px]">GERAÇÃO</span>
							<span className="font-mono text-2xl text-accent">{target.geracao}</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{mode && stage >= 3 && (
				<p className="font-pixel text-[8px] text-txt-dim tracking-[2px] mt-1">
					MODO {mode.label}
				</p>
			)}

			<AnimatePresence>
				{stage >= 3 && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className="flex gap-2.5 mt-2"
					>
						<button
							type="button"
							onClick={onAgain}
							className="px-4.5 py-3 bg-accent text-bg-deep font-pixel text-[10px] tracking-[1px] border-2 border-b-4 border-bg-deep rounded-sm active:translate-y-0.5 active:border-b-2"
						>
							JOGAR DE NOVO
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
