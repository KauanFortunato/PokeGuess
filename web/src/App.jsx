import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import getRandomPokemon from './api/randomPoke';
import { setMuted as setFeedbackMuted } from './game/feedback';
import { MODES, DEFAULT_MODE } from './game/modes';
import { ALL_GENS } from './game/gens';
import Splash from './screens/Splash';
import Game from './screens/Game';
import Win from './screens/Win';
import Lose from './screens/Lose';
import Settings from './screens/Settings';

function LoadingScreen({ label, error }) {
	return (
		<div className="flex-1 flex flex-col items-center justify-center gap-5 bg-bg-deep">
			<motion.img
				src="/img/creature.png"
				alt=""
				className="w-[150px] h-[150px] object-contain"
				animate={{ y: [0, -8, 0] }}
				transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
			/>
			<p className="font-pixel text-[11px] text-accent tracking-[2px]">
				{label}
				<span className="animate-pulse">...</span>
			</p>
			{error && <p className="font-mono text-base text-miss mt-2">{error}</p>}
		</div>
	);
}

export default function App() {
	const [screen, setScreen] = useState('splash');
	const [modeKey, setModeKey] = useState(DEFAULT_MODE);
	const [gens, setGens] = useState(ALL_GENS);
	const [muted, setMuted] = useState(false);

	const [target, setTarget] = useState(null);
	const [guesses, setGuesses] = useState([]);
	const [gaveUp, setGaveUp] = useState(false);
	const [loadingTarget, setLoadingTarget] = useState(false);
	const [error, setError] = useState(null);
	const [settingsOpen, setSettingsOpen] = useState(false);

	useEffect(() => {
		setFeedbackMuted(muted);
	}, [muted]);

	const mode = MODES[modeKey];

	const drawTarget = useCallback(
		async (overrideGens) => {
			setLoadingTarget(true);
			setError(null);
			try {
				const p = await getRandomPokemon(overrideGens || gens);
				if (!p) throw new Error('Falha ao obter Pokémon');
				setTarget(p);
			} catch (err) {
				setError(err.message || 'Erro de conexão');
			} finally {
				setLoadingTarget(false);
			}
		},
		[gens]
	);

	const startGame = useCallback(async () => {
		setGuesses([]);
		setGaveUp(false);
		await drawTarget();
		setScreen('game');
	}, [drawTarget]);

	const handleWin = useCallback((gs) => {
		setGuesses(gs);
		setScreen('win');
	}, []);

	const handleLose = useCallback((gs) => {
		setGuesses(gs);
		setGaveUp(false);
		setScreen('lose');
	}, []);

	const giveUp = useCallback(() => {
		setSettingsOpen(false);
		setGaveUp(true);
		setScreen('lose');
	}, []);

	const backToMenu = useCallback(() => {
		setSettingsOpen(false);
		setScreen('splash');
	}, []);

	const applySettings = useCallback(
		async ({ mode: newMode, gens: newGens, muted: newMuted }) => {
			const wasInGame = screen === 'game';
			setModeKey(newMode);
			setGens(newGens);
			setMuted(newMuted);
			setSettingsOpen(false);
			if (wasInGame) {
				setGuesses([]);
				setGaveUp(false);
				await drawTarget(newGens);
			}
		},
		[screen, drawTarget]
	);

	let content;
	if (screen === 'splash') {
		content = (
			<Splash
				onStart={startGame}
				onOpenSettings={() => setSettingsOpen(true)}
				mode={mode}
				gens={gens}
			/>
		);
	} else if (screen === 'game') {
		if (loadingTarget || !target) {
			content = <LoadingScreen label="SORTEANDO CRIATURA" error={error} />;
		} else {
			content = (
				<Game
					target={target}
					mode={mode}
					gens={gens}
					onWin={handleWin}
					onLose={handleLose}
					onOpenSettings={() => setSettingsOpen(true)}
				/>
			);
		}
	} else if (screen === 'win') {
		content = (
			<Win target={target} guesses={guesses} mode={mode} onAgain={startGame} />
		);
	} else if (screen === 'lose') {
		content = (
			<Lose target={target} mode={mode} gaveUp={gaveUp} onAgain={startGame} />
		);
	}

	return (
		<div className="min-h-full flex justify-center bg-bg-root">
			<div className="w-full max-w-[440px] min-h-screen flex flex-col bg-bg-deep">
				{content}
			</div>
			<Settings
				open={settingsOpen}
				initialMode={modeKey}
				initialGens={gens}
				initialMuted={muted}
				inGame={screen === 'game'}
				onApply={applySettings}
				onGiveUp={giveUp}
				onBackToMenu={backToMenu}
				onClose={() => setSettingsOpen(false)}
			/>
		</div>
	);
}
