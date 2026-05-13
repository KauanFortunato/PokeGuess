import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Platform,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
	useFonts,
	PressStart2P_400Regular,
} from '@expo-google-fonts/press-start-2p';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { colors, fonts } from './src/theme/tokens';
import getRandomPokemon from './src/api/randomPoke';
import { setMuted as setFeedbackMuted } from './src/game/feedback';
import { MODES, DEFAULT_MODE } from './src/game/modes';
import { ALL_GENS } from './src/game/gens';
import SplashScreen from './src/screens/splash';
import GameScreen from './src/screens/game';
import WinScreen from './src/screens/win';
import LoseScreen from './src/screens/lose';
import SettingsModal from './src/screens/settings';

export default function App() {
	const [fontsLoaded] = useFonts({
		PressStart2P_400Regular,
		VT323_400Regular,
	});

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

	const drawTarget = useCallback(async () => {
		setLoadingTarget(true);
		setError(null);
		try {
			const p = await getRandomPokemon(gens);
			if (!p) throw new Error('Falha ao obter Pokémon');
			setTarget(p);
		} catch (err) {
			setError(err.message || 'Erro de conexão');
		} finally {
			setLoadingTarget(false);
		}
	}, [gens]);

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
				setLoadingTarget(true);
				setError(null);
				try {
					const p = await getRandomPokemon(newGens);
					setTarget(p);
				} catch (err) {
					setError(err.message || 'Erro de conexão');
				} finally {
					setLoadingTarget(false);
				}
			}
		},
		[screen]
	);

	if (!fontsLoaded) {
		return (
			<View style={styles.bootRoot}>
				<ActivityIndicator color={colors.accent} />
			</View>
		);
	}

	let content;
	if (screen === 'splash') {
		content = (
			<SplashScreen
				onStart={startGame}
				onOpenSettings={() => setSettingsOpen(true)}
				mode={mode}
				gens={gens}
			/>
		);
	} else if (screen === 'game') {
		if (loadingTarget || !target) {
			content = (
				<View style={styles.loadingRoot}>
					<ActivityIndicator color={colors.accent} size="large" />
					<Text style={styles.loadingText}>SORTEANDO CRIATURA...</Text>
					{error ? <Text style={styles.errorText}>{error}</Text> : null}
				</View>
			);
		} else {
			content = (
				<GameScreen
					target={target}
					mode={mode}
					gens={gens}
					muted={muted}
					onWin={handleWin}
					onLose={handleLose}
					onOpenSettings={() => setSettingsOpen(true)}
				/>
			);
		}
	} else if (screen === 'win') {
		content = (
			<WinScreen
				target={target}
				guesses={guesses}
				mode={mode}
				onAgain={startGame}
			/>
		);
	} else if (screen === 'lose') {
		content = (
			<LoseScreen
				target={target}
				mode={mode}
				gaveUp={gaveUp}
				onAgain={startGame}
			/>
		);
	}

	return (
		<SafeAreaProvider>
			<StatusBar barStyle="light-content" backgroundColor={colors.bgDeep} />
			<View style={styles.root}>
				<View style={styles.device}>{content}</View>
				<SettingsModal
					visible={settingsOpen}
					initialMode={modeKey}
					initialGens={gens}
					initialMuted={muted}
					inGame={screen === 'game'}
					onApply={applySettings}
					onGiveUp={giveUp}
					onBackToMenu={backToMenu}
					onClose={() => setSettingsOpen(false)}
				/>
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: colors.bgRoot,
	},
	device: {
		flex: 1,
		backgroundColor: colors.bgDeep,
		...Platform.select({
			web: {
				maxWidth: 440,
				maxHeight: 820,
				width: '100%',
				height: '100%',
				alignSelf: 'center',
				marginVertical: 20,
				borderRadius: 14,
				borderWidth: 4,
				borderColor: '#5d4f9c',
				overflow: 'hidden',
			},
		}),
	},
	bootRoot: {
		flex: 1,
		backgroundColor: colors.bgDeep,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingRoot: {
		flex: 1,
		backgroundColor: colors.bgDeep,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
	},
	loadingText: {
		color: colors.accent,
		fontFamily: fonts.pixel,
		fontSize: 10,
		letterSpacing: 2,
	},
	errorText: {
		color: colors.miss,
		fontFamily: fonts.mono,
		fontSize: 16,
		marginTop: 8,
	},
});
