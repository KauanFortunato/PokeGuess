import React, { useEffect, useRef } from 'react';
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

function BobbingImage({ uri }) {
	const y = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(y, {
					toValue: -6,
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
			<Image source={{ uri }} style={styles.creature} resizeMode="contain" />
		</Animated.View>
	);
}

export default function LoseScreen({ target, mode, gaveUp, onAgain }) {
	const shake = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		haptics.error();
		const cryTimer = setTimeout(() => playCry(target?.id), 400);
		Animated.sequence([
			Animated.timing(shake, {
				toValue: -1,
				duration: 80,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
			Animated.timing(shake, {
				toValue: 1,
				duration: 80,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
			Animated.timing(shake, {
				toValue: -1,
				duration: 80,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
			Animated.timing(shake, {
				toValue: 0,
				duration: 80,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		]).start();
		return () => clearTimeout(cryTimer);
	}, [shake, target]);

	const translateX = shake.interpolate({
		inputRange: [-1, 1],
		outputRange: [-4, 4],
	});

	return (
		<LinearGradient colors={['#3a1a1a', colors.bgDeep]} style={styles.screen}>
			<Animated.Text style={[styles.title, { transform: [{ translateX }] }]}>
				{gaveUp ? 'DESISTIU' : 'DERROTA'}
			</Animated.Text>

			<BobbingImage uri={target.img_poke} />

			<Text style={styles.reveal}>
				ERA <Text style={styles.name}>{target.nome}</Text>
			</Text>

			<Text style={styles.info}>
				{target.tipos.join(' · ')} · GEN {target.geracao} · {target.cor}
			</Text>

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
					<Text style={styles.btnText}>TENTAR DE NOVO</Text>
				</Pressable>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 30,
		gap: 20,
	},
	title: {
		fontFamily: fonts.pixel,
		fontSize: 32,
		color: colors.miss,
		letterSpacing: 4,
		textShadowColor: colors.bgDeep,
		textShadowOffset: { width: 4, height: 4 },
		textShadowRadius: 0,
	},
	creature: {
		width: 200,
		height: 200,
	},
	reveal: {
		fontFamily: fonts.mono,
		fontSize: 22,
		color: colors.txt,
		letterSpacing: 2,
	},
	name: {
		color: colors.accentPink,
		fontFamily: fonts.pixel,
		fontSize: 16,
		letterSpacing: 2,
	},
	info: {
		fontFamily: fonts.pixel,
		fontSize: 8,
		color: colors.txtDim,
		letterSpacing: 2,
		textAlign: 'center',
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
	btnText: {
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
