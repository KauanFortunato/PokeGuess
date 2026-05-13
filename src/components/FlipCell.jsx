import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { hapticForKind } from '../game/feedback';

const KIND_STYLES = {
	match: 'bg-match border-match-deep text-bg-deep',
	partial: 'bg-partial border-partial-deep text-bg-deep',
	miss: 'bg-miss border-miss-deep text-white',
};

export default function FlipCell({ cell, delay, animate }) {
	const [flipped, setFlipped] = useState(!animate);

	useEffect(() => {
		if (!animate) {
			setFlipped(true);
			return;
		}
		const t = setTimeout(() => {
			hapticForKind(cell.kind);
			setFlipped(true);
		}, delay);
		return () => clearTimeout(t);
	}, [animate, delay, cell.kind]);

	return (
		<div className="flex-1 h-11" style={{ perspective: '600px' }}>
			<div
				className="relative w-full h-full transition-transform duration-[380ms] ease-out"
				style={{
					transformStyle: 'preserve-3d',
					transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
				}}
			>
				<div
					className="absolute inset-0 flex items-center justify-center rounded-sm border-[1.5px] border-line-soft bg-bg-cell text-txt-dim font-pixel text-xs"
					style={{ backfaceVisibility: 'hidden' }}
				>
					?
				</div>
				<div
					className={clsx(
						'absolute inset-0 flex items-center justify-center rounded-sm border-[1.5px] font-pixel text-[9px] text-center px-0.5',
						KIND_STYLES[cell.kind] || KIND_STYLES.miss
					)}
					style={{
						backfaceVisibility: 'hidden',
						transform: 'rotateX(180deg)',
						boxShadow: `inset 0 -3px 0 var(--tw-shadow-color)`,
					}}
				>
					<span className="truncate max-w-full">
						{cell.value}
						{cell.arrow ? ' ' + cell.arrow : ''}
					</span>
				</div>
			</div>
		</div>
	);
}
