import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptics } from '../game/feedback';
import { getPokeSpriteUrl } from '../api/pokeApiService';

const FEATURED_IDS = [25, 6, 9, 3];
const STARS = Array.from({ length: 22 }, (_, i) => ({
	id: i,
	left: `${(i * 37) % 100}%`,
	top: `${(i * 53) % 100}%`,
	delay: `${(i % 5) * 0.3}s`,
}));

export default function Splash({ onStart, onOpenSettings, mode, gens }) {
	const [exiting, setExiting] = useState(false);
	const [showFlash, setShowFlash] = useState(false);

	const handleStart = () => {
		if (exiting) return;
		haptics.medium();
		setShowFlash(true);
		setTimeout(() => setShowFlash(false), 280);
		setExiting(true);
		setTimeout(() => onStart(), 480);
	};

	const gensLabel =
		gens && gens.length === 8
			? 'TODAS'
			: gens && gens.length > 0
			? `GEN ${gens.join(',')}`
			: 'TODAS';

	return (
		<div className="relative flex-1 w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-b from-[#1a1735] to-bg-deep">
			<div className="absolute top-0 right-0 p-3 safe-top z-10">
				<button
					type="button"
					onClick={() => {
						if (exiting) return;
						haptics.tap();
						onOpenSettings();
					}}
					className="w-9 h-9 bg-bg-card border-2 border-b-[3px] border-line-soft rounded-sm flex items-center justify-center font-pixel text-base text-txt active:translate-y-px active:border-b-2"
				>
					⌗
				</button>
			</div>

			<div className="absolute inset-0 pointer-events-none">
				{STARS.map((s) => (
					<div
						key={s.id}
						className="absolute w-[3px] h-[3px] bg-accent animate-twinkle"
						style={{ left: s.left, top: s.top, animationDelay: s.delay }}
					/>
				))}
			</div>

			<motion.div
				initial={{ opacity: 1, scale: 1 }}
				animate={exiting ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
				className="relative flex flex-col items-center"
			>
				<div className="flex gap-7 mb-6">
					{FEATURED_IDS.map((id, i) => (
						<motion.img
							key={id}
							src={getPokeSpriteUrl(id)}
							alt=""
							className="w-14 h-14 object-contain"
							style={{
								filter: 'brightness(0.3) saturate(0.6) hue-rotate(220deg)',
							}}
							animate={{ y: [0, -6, 0] }}
							transition={{
								duration: 1.4,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: i * 0.15,
							}}
						/>
					))}
				</div>

				<motion.img
					src="/img/creature.png"
					alt="Purrglow"
					className="w-[110px] h-[110px] mb-3.5 object-contain"
					animate={{ y: [0, -8, 0] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
				/>

				<div className="text-center relative">
					<h1 className="font-pixel text-4xl text-accent leading-none tracking-[2px] relative inline-block">
						<span className="absolute top-1 left-1 text-black">POKE</span>
						<span className="relative">POKE</span>
					</h1>
					<h1 className="font-pixel text-4xl text-accent leading-none tracking-[2px] mt-1.5 relative inline-block">
						<span className="absolute top-1 left-1 text-black">GUESS</span>
						<span className="relative">GUESS</span>
					</h1>
				</div>

				<div className="flex items-center gap-2.5 mt-5">
					<span className="w-7 h-0.5 bg-accent-pink" />
					<span className="font-pixel text-[11px] text-accent-pink tracking-[3px]">
						RETRO EDITION
					</span>
					<span className="w-7 h-0.5 bg-accent-pink" />
				</div>

				<button
					type="button"
					onClick={handleStart}
					disabled={exiting}
					className="mt-7 px-4.5 py-2.5 font-pixel text-sm text-txt tracking-[2px] animate-blink active:scale-95 disabled:opacity-50"
				>
					▶ PRESS START
				</button>

				{mode && (
					<p className="mt-4 font-pixel text-[8px] text-accent tracking-[2px] text-center">
						MODO {mode.label} · {gensLabel}
					</p>
				)}
			</motion.div>

			<motion.p
				animate={{ opacity: exiting ? 0 : 1 }}
				transition={{ duration: 0.4 }}
				className="absolute bottom-6 left-0 right-0 text-center font-pixel text-[8px] text-txt-faint tracking-[1px] safe-bottom"
			>
				v1.0 · RETRO EDITION
			</motion.p>

			<AnimatePresence>
				{showFlash && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.12 }}
						className="absolute inset-0 bg-white pointer-events-none z-50"
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
