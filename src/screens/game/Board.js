import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import GuessRow, { SPRITE_CELL_WIDTH } from './GuessRow';

export default function Board({
	guesses,
	target,
	animatingIndex,
	maxGuesses,
	singleGenMode,
}) {
	const total = Number.isFinite(maxGuesses)
		? maxGuesses
		: Math.max(guesses.length + 1, 6);

	const headers = ['TIPO', singleGenMode ? 'EVO' : 'GER', 'COR', 'HABITAT', 'ALT', 'PESO'];

	return (
		<View style={styles.wrap}>
			<View style={styles.headerRow}>
				<View style={styles.spriteHeader}>
					<Text
						style={[styles.headerCell, styles.headerLeft]}
						numberOfLines={1}
						adjustsFontSizeToFit
						minimumFontScale={0.5}
						allowFontScaling={false}
					>
						CRIATURA
					</Text>
				</View>
				{headers.map((h) => (
					<View key={h} style={styles.headerCellWrap}>
						<Text
							style={styles.headerCell}
							numberOfLines={1}
							adjustsFontSizeToFit
							minimumFontScale={0.5}
							allowFontScaling={false}
						>
							{h}
						</Text>
					</View>
				))}
			</View>

			{Array.from({ length: total }).map((_, i) => (
				<GuessRow
					key={i}
					guess={guesses[i]}
					target={target}
					animate={i === animatingIndex}
					singleGenMode={singleGenMode}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: 8,
	},
	headerRow: {
		flexDirection: 'row',
		gap: 3,
		marginBottom: 6,
		paddingBottom: 4,
	},
	spriteHeader: {
		width: SPRITE_CELL_WIDTH,
		justifyContent: 'center',
	},
	headerCellWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerCell: {
		fontFamily: fonts.pixel,
		fontSize: 7,
		color: colors.txtDim,
		letterSpacing: 1,
		textAlign: 'center',
		paddingVertical: 4,
	},
	headerLeft: {
		textAlign: 'left',
		paddingLeft: 4,
	},
});
