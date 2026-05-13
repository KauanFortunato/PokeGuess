import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated,
	Easing,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../../theme/tokens';
import { haptics } from '../../game/feedback';
import { playCry } from '../../game/sound';

const CONFETTI_COLORS = ['#ffd23f', '#ff6b9d', '#7fffd4', '#94e344', '#41a6f6', '#ef7d57'];

function ConfettiPiece({ left, color, size, delay, duration, drift }) {
	const y = useRef(new Animated.Value(0)).current;
	const op = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		const t = setTimeout(() => {
			Animated.parallel([
				Animated.timing(y, {
					toValue: 1,
					duration,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(op, {
					toValue: 0,
					duration,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
			]).start();
		}, delay);
		return () => clearTimeout(t);
	}, [delay, duration, y, op]);

	const translateY = y.interpolate({ inputRange: [0, 1], outputRange: [-8, 700] });
	const translateX = y.interpolate({ inputRange: [0, 1], outputRange: [0, drift] });
	const rotate = y.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

	return (
		<Animated.View
			pointerEvents="none"
			style={{
				position: 'absolute',
				top: 0,
				left,
				width: size,
				height: size,
				backgroundColor: color,
				opacity: op,
				transform: [{ translateY }, { translateX }, { rotate }],
			}}
		/>
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
				delay: Math.random() * 600,
				duration: 1400 + Math.random() * 1200,
				drift: (Math.random() - 0.5) * 80,
			})),
		[]
	);
	return (
		<View pointerEvents="none" style={StyleSheet.absoluteFill}>
			{pieces.map((p) => (
				<ConfettiPiece key={p.id} {...p} />
			))}
		</View>
	);
}

function Orb({ stage }) {
	const rot = useRef(new Animated.Value(0)).current;
	const scale = useRef(new Animated.Value(0.6)).current;
	const op = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(rot, {
				toValue: 1,
				duration: 800,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
			Animated.spring(scale, {
				toValue: 1,
				friction: 6,
				useNativeDriver: true,
			}),
			Animated.timing(op, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start();
	}, [rot, scale, op]);

	useEffect(() => {
		if (stage >= 1) {
			Animated.parallel([
				Animated.timing(scale, {
					toValue: 3,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(op, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [stage, scale, op]);

	const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] });

	return (
		<Animated.View
			style={[
				styles.orb,
				{ opacity: op, transform: [{ rotate }, { scale }] },
			]}
		>
			<LinearGradient
				colors={['#ffd23f', '#e89c1d', '#a85f0a']}
				start={{ x: 0.35, y: 0.35 }}
				end={{ x: 1, y: 1 }}
				style={styles.orbBody}
			/>
			<View style={styles.orbBand} />
			<View style={styles.orbCenter}>
				<View style={styles.orbCenterInner} />
			</View>
		</Animated.View>
	);
}

function CreatureReveal({ uri }) {
	const scale = useRef(new Animated.Value(0)).current;
	const op = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.parallel([
			Animated.spring(scale, {
				toValue: 1,
				friction: 5,
				tension: 80,
				useNativeDriver: true,
			}),
			Animated.timing(op, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start();
	}, [scale, op]);

	return (
		<Animated.View style={{ opacity: op, transform: [{ scale }] }}>
			<Image source={{ uri }} style={styles.creature} resizeMode="contain" />
		</Animated.View>
	);
}

export default function WinScreen({ target, guesses, mode, onAgain }) {
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
		<LinearGradient
			colors={['#2a1c5a', colors.bgDeep]}
			style={styles.screen}
		>
			{stage >= 3 && <Confetti />}

			<View style={styles.stage}>
				{stage < 2 && <Orb stage={stage} />}
				{stage >= 2 && <CreatureReveal uri={target.img_poke} />}
			</View>

			{stage >= 3 && (
				<>
					<View style={styles.banner}>
						<Text style={styles.bannerLine1}>VITÓRIA!</Text>
						<Text style={styles.bannerLine2}>
							É <Text style={styles.bannerName}>{target.nome}</Text>!
						</Text>
					</View>

					<View style={styles.stats}>
						<View style={styles.statCol}>
							<Text style={styles.statDim}>TENTATIVAS</Text>
							<Text style={styles.statValue}>{guesses.length}</Text>
						</View>
						<View style={styles.statCol}>
							<Text style={styles.statDim}>TIPO</Text>
							<Text style={styles.statValue}>{target.tipos.join('/')}</Text>
						</View>
						<View style={styles.statCol}>
							<Text style={styles.statDim}>GERAÇÃO</Text>
							<Text style={styles.statValue}>{target.geracao}</Text>
						</View>
					</View>

					{mode && (
						<Text style={styles.modeTag}>MODO {mode.label}</Text>
					)}

					<View style={styles.actions}>
						<Pressable
							onPress={onAgain}
							style={({ pressed }) => [
								styles.btn,
								styles.btnPrimary,
								pressed && styles.btnPressed,
							]}
						>
							<Text style={styles.btnPrimaryText}>JOGAR DE NOVO</Text>
						</Pressable>
					</View>
				</>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		gap: 18,
	},
	stage: {
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 240,
	},
	orb: {
		width: 120,
		height: 120,
		alignItems: 'center',
		justifyContent: 'center',
	},
	orbBody: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 60,
		borderWidth: 4,
		borderColor: colors.bgDeep,
	},
	orbBand: {
		position: 'absolute',
		top: 54,
		left: 0,
		right: 0,
		height: 12,
		backgroundColor: colors.bgDeep,
	},
	orbCenter: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.bgDeep,
		alignItems: 'center',
		justifyContent: 'center',
	},
	orbCenterInner: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#fff',
	},
	creature: {
		width: 224,
		height: 224,
	},
	banner: {
		alignItems: 'center',
	},
	bannerLine1: {
		fontFamily: fonts.pixel,
		fontSize: 28,
		color: colors.accent,
		letterSpacing: 3,
		textShadowColor: colors.bgDeep,
		textShadowOffset: { width: 4, height: 4 },
		textShadowRadius: 0,
	},
	bannerLine2: {
		fontFamily: fonts.mono,
		fontSize: 24,
		color: colors.txt,
		marginTop: 12,
		letterSpacing: 1,
	},
	bannerName: {
		color: colors.accentPink,
		fontFamily: fonts.pixel,
		fontSize: 16,
		letterSpacing: 2,
	},
	stats: {
		flexDirection: 'row',
		gap: 14,
	},
	statCol: {
		alignItems: 'center',
		gap: 2,
	},
	statDim: {
		fontFamily: fonts.pixel,
		fontSize: 6,
		color: colors.txtDim,
		letterSpacing: 1,
	},
	statValue: {
		fontFamily: fonts.mono,
		fontSize: 22,
		color: colors.accent,
	},
	actions: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 8,
	},
	btn: {
		paddingVertical: 12,
		paddingHorizontal: 18,
		borderWidth: 2,
		borderBottomWidth: 4,
		borderColor: colors.bgDeep,
		borderRadius: 2,
	},
	btnPrimary: {
		backgroundColor: colors.accent,
	},
	btnPressed: {
		borderBottomWidth: 2,
		transform: [{ translateY: 2 }],
	},
	btnPrimaryText: {
		fontFamily: fonts.pixel,
		fontSize: 10,
		color: colors.bgDeep,
		letterSpacing: 1,
	},
	modeTag: {
		fontFamily: fonts.pixel,
		fontSize: 8,
		color: colors.txtDim,
		letterSpacing: 2,
		marginTop: 4,
	},
});
