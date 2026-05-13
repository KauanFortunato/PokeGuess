import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme/tokens';
import { getPokeSpriteUrl } from '../../api/pokeApiService';
import { haptics } from '../../game/feedback';

const CREATURE = require('../../../assets/img/creature.png');
const FEATURED_IDS = [25, 6, 9, 3]; // Pikachu, Charizard, Blastoise, Venusaur

function BobbingSilhouette({ id, delay }) {
	const y = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(y, {
					toValue: -6,
					duration: 700,
					useNativeDriver: true,
				}),
				Animated.timing(y, {
					toValue: 0,
					duration: 700,
					useNativeDriver: true,
				}),
			])
		);
		const timer = setTimeout(() => loop.start(), delay);
		return () => {
			clearTimeout(timer);
			loop.stop();
		};
	}, [delay, y]);

	return (
		<Animated.View style={{ transform: [{ translateY: y }] }}>
			<Image
				source={{ uri: getPokeSpriteUrl(id) }}
				style={[styles.silhouette, { tintColor: '#3a2f5e' }]}
				resizeMode="contain"
			/>
		</Animated.View>
	);
}

function BobbingMascot() {
	const y = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(y, {
					toValue: -8,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(y, {
					toValue: 0,
					duration: 800,
					useNativeDriver: true,
				}),
			])
		);
		loop.start();
		return () => loop.stop();
	}, [y]);

	return (
		<Animated.View style={{ transform: [{ translateY: y }] }}>
			<Image source={CREATURE} style={styles.mascot} resizeMode="contain" />
		</Animated.View>
	);
}

function StarField() {
	const stars = useMemo(
		() =>
			Array.from({ length: 22 }, (_, i) => ({
				key: i,
				left: `${(i * 37) % 100}%`,
				top: `${(i * 53) % 100}%`,
				delay: (i % 5) * 300,
			})),
		[]
	);
	return (
		<View pointerEvents="none" style={StyleSheet.absoluteFill}>
			{stars.map((s) => (
				<Star key={s.key} left={s.left} top={s.top} delay={s.delay} />
			))}
		</View>
	);
}

function Star({ left, top, delay }) {
	const op = useRef(new Animated.Value(0.1)).current;
	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(op, { toValue: 1, duration: 800, useNativeDriver: true }),
				Animated.timing(op, { toValue: 0.1, duration: 800, useNativeDriver: true }),
			])
		);
		const timer = setTimeout(() => loop.start(), delay);
		return () => {
			clearTimeout(timer);
			loop.stop();
		};
	}, [delay, op]);
	return (
		<Animated.View style={[styles.star, { left, top, opacity: op }]} />
	);
}

export default function SplashScreen({ onStart, onOpenSettings, mode, gens }) {
	const [blink, setBlink] = useState(true);
	const [exiting, setExiting] = useState(false);
	const fadeOut = useRef(new Animated.Value(1)).current;
	const scaleOut = useRef(new Animated.Value(1)).current;
	const flash = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const id = setInterval(() => setBlink((b) => !b), 600);
		return () => clearInterval(id);
	}, []);

	const handleStart = () => {
		if (exiting) return;
		setExiting(true);
		haptics.medium();
		Animated.sequence([
			Animated.timing(flash, {
				toValue: 1,
				duration: 120,
				useNativeDriver: true,
			}),
			Animated.parallel([
				Animated.timing(flash, {
					toValue: 0,
					duration: 280,
					useNativeDriver: true,
				}),
				Animated.timing(scaleOut, {
					toValue: 1.1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(fadeOut, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]),
		]).start(() => {
			onStart();
		});
	};

	const gensLabel =
		gens && gens.length === 8
			? 'TODAS'
			: gens && gens.length > 0
			? `GEN ${gens.join(',')}`
			: 'TODAS';

	return (
		<LinearGradient colors={['#1a1735', colors.bgDeep]} style={styles.screen}>
			<SafeAreaView edges={['top']} style={styles.safeTop}>
				<Pressable
					onPress={() => {
						if (exiting) return;
						haptics.tap();
						onOpenSettings();
					}}
					style={({ pressed }) => [
						styles.gearBtn,
						pressed && styles.gearBtnPressed,
					]}
				>
					<Text style={styles.gearText}>⌗</Text>
				</Pressable>
			</SafeAreaView>

			<StarField />

			<Animated.View
				style={[
					styles.center,
					{ opacity: fadeOut, transform: [{ scale: scaleOut }] },
				]}
			>
				<View style={styles.silhouettes}>
					{FEATURED_IDS.map((id, i) => (
						<BobbingSilhouette key={id} id={id} delay={i * 150} />
					))}
				</View>

				<BobbingMascot />

				<View style={styles.titleWrap}>
					<View>
						<Text style={[styles.title, styles.titleShadow]}>POKE</Text>
						<Text style={[styles.title, styles.titleMain]}>POKE</Text>
					</View>
					<View style={{ marginTop: 6 }}>
						<Text style={[styles.title, styles.titleShadow]}>GUESS</Text>
						<Text style={[styles.title, styles.titleMain]}>GUESS</Text>
					</View>
				</View>

				<View style={styles.retroBar}>
					<View style={styles.retroDash} />
					<Text style={styles.retroText}>RETRO EDITION</Text>
					<View style={styles.retroDash} />
				</View>

				<Pressable
					onPress={handleStart}
					disabled={exiting}
					style={({ pressed }) => [
						styles.pressStart,
						{
							opacity: blink ? 1 : 0.35,
							transform: [{ scale: pressed ? 0.98 : 1 }],
						},
					]}
				>
					<Text style={styles.pressStartText}>▶ PRESS START</Text>
				</Pressable>

				{mode && (
					<Text style={styles.modeLine}>
						MODO {mode.label} · {gensLabel}
					</Text>
				)}
			</Animated.View>

			<Animated.Text style={[styles.foot, { opacity: fadeOut }]}>
				v1.0 · ORIGINAL EDITION
			</Animated.Text>

			<Animated.View
				pointerEvents="none"
				style={[styles.flash, { opacity: flash }]}
			/>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 24,
	},
	safeTop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		alignItems: 'flex-end',
		padding: 12,
		zIndex: 5,
	},
	gearBtn: {
		width: 36,
		height: 36,
		backgroundColor: colors.bgCard,
		borderWidth: 2,
		borderBottomWidth: 3,
		borderColor: colors.lineSoft,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 2,
	},
	gearBtnPressed: {
		borderBottomWidth: 2,
		transform: [{ translateY: 1 }],
	},
	gearText: {
		color: colors.txt,
		fontFamily: fonts.pixel,
		fontSize: 16,
	},
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modeLine: {
		marginTop: 18,
		fontFamily: fonts.pixel,
		fontSize: 8,
		color: colors.accent,
		letterSpacing: 2,
		textAlign: 'center',
	},
	star: {
		position: 'absolute',
		width: 3,
		height: 3,
		backgroundColor: colors.accent,
	},
	silhouettes: {
		flexDirection: 'row',
		gap: 28,
		marginBottom: 24,
	},
	silhouette: {
		width: 56,
		height: 56,
	},
	mascot: {
		width: 110,
		height: 110,
		marginBottom: 14,
	},
	retroBar: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginTop: 18,
	},
	retroDash: {
		width: 28,
		height: 2,
		backgroundColor: colors.accentPink,
	},
	retroText: {
		fontFamily: fonts.pixel,
		fontSize: 11,
		color: colors.accentPink,
		letterSpacing: 3,
	},
	titleWrap: {
		alignItems: 'center',
	},
	title: {
		fontFamily: fonts.pixel,
		fontSize: 40,
		letterSpacing: 2,
	},
	titleShadow: {
		color: '#000',
		position: 'absolute',
		top: 4,
		left: 4,
	},
	titleMain: {
		color: colors.accent,
	},
	tagline: {
		fontFamily: fonts.mono,
		fontSize: 22,
		color: colors.accentPink,
		letterSpacing: 3,
		marginTop: 16,
		textAlign: 'center',
	},
	pressStart: {
		marginTop: 36,
		paddingVertical: 10,
		paddingHorizontal: 18,
	},
	pressStartText: {
		fontFamily: fonts.pixel,
		fontSize: 14,
		color: colors.txt,
		letterSpacing: 2,
	},
	foot: {
		position: 'absolute',
		bottom: 24,
		left: 0,
		right: 0,
		textAlign: 'center',
		fontFamily: fonts.pixel,
		fontSize: 8,
		color: colors.txtFaint,
		letterSpacing: 1,
	},
	flash: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#fff',
		zIndex: 50,
	},
});
