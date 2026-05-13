import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { haptics } from '../game/feedback';
import { playCry } from '../game/sound';

export default function Lose({ target, mode, gaveUp, onAgain }) {
	useEffect(() => {
		haptics.error();
		const timer = setTimeout(() => playCry(target?.id), 400);
		return () => clearTimeout(timer);
	}, [target]);

	return (
		<div
			className="flex-1 flex flex-col items-center justify-center gap-5 p-7 safe-top safe-bottom"
			style={{ background: 'radial-gradient(ellipse at center, #3a1a1a 0%, #0c0a1a 80%)' }}
		>
			<motion.h2
				animate={{ x: [-4, 4, -4, 0] }}
				transition={{ duration: 0.4, times: [0.25, 0.5, 0.75, 1] }}
				className="font-pixel text-3xl text-miss tracking-[4px]"
				style={{ textShadow: '4px 4px 0 #0c0a1a' }}
			>
				{gaveUp ? 'DESISTIU' : 'DERROTA'}
			</motion.h2>

			<motion.img
				src={target.img_poke}
				alt={target.nome}
				className="w-48 h-48 object-contain"
				animate={{ y: [0, -6, 0] }}
				transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
			/>

			<p className="font-mono text-2xl text-txt tracking-[2px]">
				ERA{' '}
				<span className="font-pixel text-base text-accent-pink tracking-[2px]">
					{target.nome}
				</span>
			</p>

			<p className="font-pixel text-[8px] text-txt-dim tracking-[2px] text-center">
				{target.tipos.join(' · ')} · GEN {target.geracao} · {target.cor}
			</p>

			{mode && (
				<p className="font-pixel text-[8px] text-txt-dim tracking-[2px]">
					MODO {mode.label}
				</p>
			)}

			<div className="flex gap-2.5 mt-2">
				<button
					type="button"
					onClick={onAgain}
					className="px-4.5 py-3 bg-accent text-bg-deep font-pixel text-[10px] tracking-[1px] border-2 border-b-4 border-bg-deep rounded-sm active:translate-y-0.5 active:border-b-2"
				>
					TENTAR DE NOVO
				</button>
			</div>
		</div>
	);
}
