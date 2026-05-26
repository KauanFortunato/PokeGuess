import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Play, Settings2 } from 'lucide-react';
import { haptics } from '../game/feedback';
import { getPokeSpriteUrl } from '../api/pokeApiService';

const FEATURED_IDS = [25, 6, 9, 3];
const STARS = Array.from({ length: 22 }, (_, i) => ({
	id: i,
	left: `${(i * 37) % 100}%`,
	top: `${(i * 53) % 100}%`,
	delay: `${(i % 5) * 0.3}s`,
}));

const DAILY_STATUS_LABELS = {
	in_progress: 'EM ANDAMENTO',
	won: 'VITORIA',
	lost: 'DERROTA',
	gave_up: 'DESISTIU',
};

export default function Splash({
	onStart,
	onDailyStart,
	onOpenSettings,
	mode,
	gens,
	dailyProgress,
	dailyStreak,
}) {
	const [exiting, setExiting] = useState(false);
	const [showFlash, setShowFlash] = useState(false);

	const handleStart = (startFn) => {
		if (exiting) return;
		haptics.medium();
		setShowFlash(true);
		setTimeout(() => setShowFlash(false), 280);
		setExiting(true);
		setTimeout(() => startFn(), 480);
	};

	const gensLabel =
		gens && gens.length === 8
			? 'TODAS'
			: gens && gens.length > 0
			? `GEN ${gens.join(',')}`
			: 'TODAS';

	const dailyStatusLabel = dailyProgress
		? DAILY_STATUS_LABELS[dailyProgress.status] || DAILY_STATUS_LABELS.in_progress
		: null;

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
					className="pixel-icon-button"
					aria-label="Abrir ajustes"
				>
					<Settings2 size={18} strokeWidth={2.6} />
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
				className="relative flex w-full flex-col items-center"
			>
				<div className="flex gap-7 mb-6">
					{FEATURED_IDS.map((id, i) => (
						<motion.div
							key={id}
							className="w-14 h-14"
							style={{
								WebkitMaskImage: `url(${getPokeSpriteUrl(id)})`,
								maskImage: `url(${getPokeSpriteUrl(id)})`,
								WebkitMaskSize: 'contain',
								maskSize: 'contain',
								WebkitMaskRepeat: 'no-repeat',
								maskRepeat: 'no-repeat',
								WebkitMaskPosition: 'center',
								maskPosition: 'center',
								backgroundColor: '#3a2f5e',
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

				<div className="text-center relative w-full">
					<h1 className="font-pixel text-4xl text-accent leading-none tracking-[2px] relative block">
						<span className="relative inline-block">
							<span className="absolute top-1 left-1 text-black">POKE</span>
							<span className="relative">POKE</span>
						</span>
					</h1>
					<h1 className="font-pixel text-4xl text-accent leading-none tracking-[2px] mt-1.5 relative block">
						<span className="relative inline-block">
							<span className="absolute top-1 left-1 text-black">GUESS</span>
							<span className="relative">GUESS</span>
						</span>
					</h1>
				</div>

				<div className="flex items-center gap-2.5 mt-5">
					<span className="w-7 h-0.5 bg-accent-pink" />
					<span className="font-pixel text-[11px] text-accent-pink tracking-[3px]">
						RETRO EDITION
					</span>
					<span className="w-7 h-0.5 bg-accent-pink" />
				</div>

				<div className="splash-actions">
					<button
						type="button"
						onClick={() => handleStart(onStart)}
						disabled={exiting}
						className="splash-start-button"
					>
						<Play size={16} fill="currentColor" strokeWidth={2.6} />
						JOGAR
					</button>
					<button
						type="button"
						onClick={() => handleStart(onDailyStart)}
						disabled={exiting}
						className="splash-daily-button"
					>
						<CalendarDays size={16} strokeWidth={2.7} />
						<span>POKEMON DO DIA</span>
					</button>
				</div>

				{mode && (
					<p className="mt-4 font-pixel text-[8px] text-accent tracking-[2px] text-center">
						MODO {mode.label} · {gensLabel}
					</p>
				)}

				<div className="mt-3 min-h-[30px] text-center">
					{dailyStatusLabel ? (
						<p className="font-pixel text-[8px] text-accent-pink tracking-[1px]">
							HOJE: {dailyStatusLabel}
							{dailyProgress.attemptsUsed > 0
								? ` · ${dailyProgress.attemptsUsed} CHUTES`
								: ''}
						</p>
					) : (
						<p className="font-pixel text-[8px] text-txt-faint tracking-[1px]">
							POKEMON DO DIA AINDA NAO JOGADO
						</p>
					)}
					<p className="font-pixel text-[8px] text-accent tracking-[1px] mt-1">
						STREAK: {dailyStreak?.current ?? 0}
						{dailyStreak?.best ? ` · MELHOR ${dailyStreak.best}` : ''}
					</p>
				</div>
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
