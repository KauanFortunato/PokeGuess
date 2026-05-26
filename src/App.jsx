import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDailyPokemon } from './api/dailyPoke';
import getRandomPokemon from './api/randomPoke';
import {
	getDailyProgressForDate,
	getDailyStreak,
	patchDailyProgress,
	shouldTrackDailyProgress,
} from './game/dailyProgress';
import { setMuted as setFeedbackMuted } from './game/feedback';
import { MODES, DEFAULT_MODE } from './game/modes';
import { ALL_GENS } from './game/gens';
import {
	cancelDailyReminderNotification,
	checkReminderPermission,
	formatReminderTime,
	getReminderSupportMessage,
	parseReminderTime,
	readReminderSettings,
	registerDailyReminderOpenListener,
	requestReminderPermission,
	scheduleDailyReminderNotification,
	writeReminderSettings,
} from './platform/notifications';
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

	const [dailyTodayProgress, setDailyTodayProgress] = useState(() =>
		getDailyProgressForDate()
	);
	const [dailyStreak, setDailyStreakState] = useState(() => getDailyStreak());
	const [reminderSettings, setReminderSettings] = useState(() =>
		readReminderSettings()
	);
	const [reminderStatus, setReminderStatus] = useState(() =>
		getReminderSupportMessage()
	);

	const mode = MODES[modeKey];

	const refreshDailySnapshot = useCallback(() => {
		setDailyTodayProgress(getDailyProgressForDate());
		setDailyStreakState(getDailyStreak());
	}, []);

	useEffect(() => {
		setFeedbackMuted(muted);
	}, [muted]);

	useEffect(() => {
		refreshDailySnapshot();
	}, [refreshDailySnapshot]);

	const drawTarget = useCallback(
		async ({ overrideGens, challenge = challengeType } = {}) => {
			setLoadingTarget(true);
			setError(null);
			try {
				const nextTarget =
					challenge === 'daily'
						? await getDailyPokemon()
						: await getRandomPokemon(overrideGens || gens);

				if (!nextTarget) throw new Error('Falha ao obter Pokemon');
				setTarget(nextTarget);
				return nextTarget;
			} catch (err) {
				setError(err.message || 'Erro de conexao');
				return null;
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
		const nextTarget = await drawTarget({ challenge: 'daily' });
		if (nextTarget) {
			patchDailyProgress({
				status: 'in_progress',
				attemptsUsed: 0,
				pokemonId: nextTarget.id,
			});
			refreshDailySnapshot();
		}
		setScreen('game');
	}, [drawTarget, refreshDailySnapshot]);

	useEffect(() => {
		let removeListener = null;
		let cancelled = false;

		registerDailyReminderOpenListener(() => {
			if (cancelled) return;
			startDaily();
		})
			.then((dispose) => {
				removeListener = dispose;
			})
			.catch(() => {
				removeListener = null;
			});

		return () => {
			cancelled = true;
			if (typeof removeListener === 'function') {
				removeListener();
			}
		};
	}, [startDaily]);

	const handleDailyGuessProgress = useCallback(
		(nextGuesses) => {
			if (!shouldTrackDailyProgress(challengeType)) return;
			patchDailyProgress({
				status: 'in_progress',
				attemptsUsed: nextGuesses.length,
				pokemonId: target?.id,
			});
			refreshDailySnapshot();
		},
		[challengeType, target, refreshDailySnapshot]
	);

	const handleWin = useCallback(
		(gs) => {
			setGuesses(gs);
			if (shouldTrackDailyProgress(challengeType)) {
				patchDailyProgress({
					status: 'won',
					attemptsUsed: gs.length,
					pokemonId: target?.id,
				});
				refreshDailySnapshot();
			}
			setScreen('win');
		},
		[challengeType, target, refreshDailySnapshot]
	);

	const handleLose = useCallback(
		(gs) => {
			setGuesses(gs);
			setGaveUp(false);
			if (shouldTrackDailyProgress(challengeType)) {
				patchDailyProgress({
					status: 'lost',
					attemptsUsed: gs.length,
					pokemonId: target?.id,
				});
				refreshDailySnapshot();
			}
			setScreen('lose');
		},
		[challengeType, target, refreshDailySnapshot]
	);

	const giveUp = useCallback(() => {
		setSettingsOpen(false);
		setGaveUp(true);
		if (shouldTrackDailyProgress(challengeType)) {
			patchDailyProgress({
				status: 'gave_up',
				attemptsUsed: guesses.length,
				pokemonId: target?.id,
			});
			refreshDailySnapshot();
		}
		setScreen('lose');
	}, [challengeType, guesses.length, target, refreshDailySnapshot]);

	const backToMenu = useCallback(() => {
		setSettingsOpen(false);
		setScreen('splash');
	}, []);

	const applySettings = useCallback(
		async ({
			mode: newMode,
			gens: newGens,
			muted: newMuted,
			reminderEnabled,
			reminderTime,
		}) => {
			const wasInGame = screen === 'game';
			setModeKey(newMode);
			setGens(newGens);
			setMuted(newMuted);

			const parsedTime = parseReminderTime(reminderTime);
			let nextReminderState = {
				enabled: Boolean(reminderEnabled),
				hour: parsedTime.hour,
				minute: parsedTime.minute,
				lastPermissionStatus: reminderSettings.lastPermissionStatus || 'unknown',
			};
			let nextReminderStatus = getReminderSupportMessage();

			try {
				if (nextReminderState.enabled) {
					const supportMessage = getReminderSupportMessage();
					if (supportMessage) {
						nextReminderState.enabled = false;
						nextReminderState.lastPermissionStatus = 'unsupported';
						nextReminderStatus = supportMessage;
					} else {
						let permission = await checkReminderPermission();
						if (
							!permission.granted &&
							(permission.status === 'prompt' ||
								permission.status === 'prompt-with-rationale')
						) {
							permission = await requestReminderPermission();
						}

						nextReminderState.lastPermissionStatus = permission.status;

						if (!permission.granted) {
							nextReminderState.enabled = false;
							nextReminderStatus =
								'Permission denied. Enable notifications in system settings.';
							await cancelDailyReminderNotification();
						} else {
							await scheduleDailyReminderNotification(parsedTime);
							nextReminderStatus = `Daily reminder set for ${formatReminderTime(
								parsedTime.hour,
								parsedTime.minute
							)}.`;
						}
					}
				} else {
					await cancelDailyReminderNotification();
					nextReminderStatus = getReminderSupportMessage();
				}
			} catch (reminderError) {
				nextReminderState.enabled = false;
				nextReminderStatus = reminderError?.message
					? `Reminder setup failed: ${reminderError.message}`
					: 'Reminder setup failed on this device.';
			}

			writeReminderSettings(nextReminderState);
			setReminderSettings(nextReminderState);
			setReminderStatus(nextReminderStatus);

			setSettingsOpen(false);

			if (wasInGame) {
				setGuesses([]);
				setGaveUp(false);
				await drawTarget({ overrideGens: newGens });
			}
		},
		[screen, drawTarget, reminderSettings.lastPermissionStatus]
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
				dailyProgress={dailyTodayProgress}
				dailyStreak={dailyStreak}
			/>
		);
	} else if (screen === 'game') {
		if (loadingTarget || !target) {
			content = (
				<LoadingScreen
					label={
						challengeType === 'daily'
							? 'CARREGANDO DESAFIO DIARIO'
							: 'SORTEANDO CRIATURA'
					}
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
					onGuessesChange={handleDailyGuessProgress}
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
				dailyStreak={dailyStreak}
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
				dailyStreak={dailyStreak}
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
				initialReminderEnabled={reminderSettings.enabled}
				initialReminderTime={formatReminderTime(
					reminderSettings.hour,
					reminderSettings.minute
				)}
				reminderStatus={reminderStatus}
				inGame={screen === 'game'}
				onApply={applySettings}
				onGiveUp={giveUp}
				onBackToMenu={backToMenu}
				onClose={() => setSettingsOpen(false)}
			/>
		</div>
	);
}
