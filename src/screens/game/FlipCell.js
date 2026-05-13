import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { hapticForKind } from '../../game/feedback';

const KIND_STYLES = {
	match: { bg: colors.match, fg: colors.bgDeep, border: colors.matchDeep },
	partial: { bg: colors.partial, fg: colors.bgDeep, border: colors.partialDeep },
	miss: { bg: colors.miss, fg: '#ffffff', border: colors.missDeep },
};

export default function FlipCell({ cell, delay, animate }) {
	const rot = useRef(new Animated.Value(animate ? 0 : 180)).current;

	useEffect(() => {
		if (!animate) {
			rot.setValue(180);
			return;
		}
		const t = setTimeout(() => {
			hapticForKind(cell.kind);
			Animated.timing(rot, {
				toValue: 180,
				duration: 380,
				useNativeDriver: true,
			}).start();
		}, delay);
		return () => clearTimeout(t);
	}, [animate, delay, rot, cell.kind]);

	const frontRotate = rot.interpolate({
		inputRange: [0, 180],
		outputRange: ['0deg', '180deg'],
	});
	const backRotate = rot.interpolate({
		inputRange: [0, 180],
		outputRange: ['180deg', '360deg'],
	});

	const kindStyle = KIND_STYLES[cell.kind] || KIND_STYLES.miss;

	return (
		<View style={styles.cellWrap}>
			<Animated.View
				style={[
					styles.face,
					styles.front,
					{ transform: [{ rotateX: frontRotate }] },
				]}
			>
				<Text style={styles.frontText}>?</Text>
			</Animated.View>
			<Animated.View
				style={[
					styles.face,
					styles.back,
					{
						backgroundColor: kindStyle.bg,
						borderColor: kindStyle.border,
						transform: [{ rotateX: backRotate }],
					},
				]}
			>
				<Text
					style={[styles.backText, { color: kindStyle.fg }]}
					numberOfLines={1}
					adjustsFontSizeToFit
					minimumFontScale={0.4}
					allowFontScaling={false}
				>
					{cell.value}
					{cell.arrow ? ' ' + cell.arrow : ''}
				</Text>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	cellWrap: {
		flex: 1,
		height: 44,
	},
	face: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderWidth: 1.5,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'center',
		backfaceVisibility: 'hidden',
		paddingHorizontal: 1,
	},
	front: {
		backgroundColor: colors.bgCell,
		borderColor: colors.lineSoft,
	},
	frontText: {
		fontFamily: fonts.pixel,
		fontSize: 12,
		color: colors.txtDim,
	},
	back: {
		// transform applied dynamically
	},
	backText: {
		fontFamily: fonts.pixel,
		fontSize: 9,
		textAlign: 'center',
		letterSpacing: 0,
		paddingHorizontal: 1,
		width: '100%',
	},
});
