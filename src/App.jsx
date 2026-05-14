import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDailyPokemon } from './api/dailyPoke';
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
	const [challengeType, setChallengeType] = useState('random');
	const [loadingTarget, setLoadingTarget] = useState(false);
	const [error, setError] = useState(null);
	const [settingsOpen, setSettingsOpen] = useState(false);

	useEffect(() => {
		setFeedbackMuted(muted);
	}, [muted]);

	const mode = MODES[modeKey];

	const drawTarget = useCallback(
		async ({ overrideGens, challenge = challengeType } = {}) => {
			setLoadingTarget(true);
			setError(null);
			try {
				const p =
					challenge === 'daily'
						? await getDailyPokemon()
						: await getRandomPokemon(overrideGens || gens);
				if (!p) throw new Error('Falha ao obter Pokémon');
				setTarget(p);
			} catch (err) {
				setError(err.message || 'Erro de conexão');
			} finally {
				setLoadingTarget(false);
			}
		},
		[challengeType, gens]
	);

	const startGame = useCallback(async () => {
		setChallengeType('random');
		setGuesses([]);
		setGaveUp(false);
		await drawTarget({ challenge: 'random' });
		setScreen('game');
	}, [drawTarget]);

	const startDaily = useCallback(async () => {
		setChallengeType('daily');
		setGuesses([]);
		setGaveUp(false);
		await drawTarget({ challenge: 'daily' });
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
				await drawTarget({ overrideGens: newGens });
			}
		},
		[screen, drawTarget]
	);

	const playAgain = challengeType === 'daily' ? startDaily : startGame;

	let content;
	if (screen === 'splash') {
		content = (
				<Splash
					onStart={startGame}
					onDailyStart={startDaily}
					onOpenSettings={() => setSettingsOpen(true)}
					mode={mode}
					gens={gens}
			/>
		);
	} else if (screen === 'game') {
		if (loadingTarget || !target) {
			content = (
				<LoadingScreen
					label={challengeType === 'daily' ? 'CARREGANDO DESAFIO DIÁRIO' : 'SORTEANDO CRIATURA'}
					error={error}
				/>
			);
		} else {
			content = (
				<Game
					target={target}
					mode={mode}
					challengeType={challengeType}
					gens={gens}
					onWin={handleWin}
					onLose={handleLose}
					onOpenSettings={() => setSettingsOpen(true)}
				/>
			);
		}
	} else if (screen === 'win') {
		content = (
			<Win
				target={target}
				guesses={guesses}
				mode={mode}
				challengeType={challengeType}
				onAgain={playAgain}
			/>
		);
	} else if (screen === 'lose') {
		content = (
			<Lose
				target={target}
				mode={mode}
				challengeType={challengeType}
				gaveUp={gaveUp}
				onAgain={playAgain}
			/>
		);
	}

	return (
		<div className="min-h-screen w-full flex flex-col bg-bg-deep">
			{content}
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
