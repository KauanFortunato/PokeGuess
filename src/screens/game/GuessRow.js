import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { comparePokemons } from '../../api/comparePoke';
import FlipCell from './FlipCell';

export const SPRITE_CELL_WIDTH = 48;

export default function GuessRow({ guess, target, animate, singleGenMode }) {
	if (!guess) {
		return (
			<View style={styles.row}>
				<View style={[styles.spriteCell, styles.empty]}>
					<Text style={styles.emptyMark}>?</Text>
				</View>
				{Array.from({ length: 6 }).map((_, i) => (
					<View key={i} style={[styles.dashCell, styles.empty]}>
						<Text style={styles.dashText}>–</Text>
					</View>
				))}
			</View>
		);
	}

	const cells = comparePokemons(guess, target, { singleGenMode });

	return (
		<View style={styles.row}>
			<View style={styles.spriteCell}>
				<Image
					source={{ uri: guess.sprite_pixel }}
					style={styles.sprite}
					resizeMode="contain"
				/>
				<Text
					style={styles.name}
					numberOfLines={1}
					adjustsFontSizeToFit
					minimumFontScale={0.4}
					allowFontScaling={false}
				>
					{(guess.nome || '').toUpperCase()}
				</Text>
			</View>
			{cells.map((c, i) => (
				<FlipCell key={i} cell={c} delay={(i + 1) * 180} animate={animate} />
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		gap: 3,
		marginBottom: 3,
	},
	spriteCell: {
		width: SPRITE_CELL_WIDTH,
		height: 44,
		backgroundColor: colors.bgMid,
		borderWidth: 1.5,
		borderColor: colors.line,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 2,
		paddingHorizontal: 2,
	},
	empty: {
		backgroundColor: 'transparent',
		borderStyle: 'dashed',
		borderColor: colors.lineSoft,
	},
	emptyMark: {
		fontFamily: fonts.pixel,
		fontSize: 12,
		color: colors.txtFaint,
		marginTop: 12,
	},
	dashCell: {
		flex: 1,
		height: 44,
		borderWidth: 1.5,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dashText: {
		fontFamily: fonts.pixel,
		fontSize: 12,
		color: colors.txtFaint,
	},
	sprite: {
		width: 26,
		height: 26,
	},
	name: {
		fontFamily: fonts.pixel,
		fontSize: 6,
		color: colors.txt,
		marginTop: 2,
		width: '100%',
		textAlign: 'center',
	},
});
