import React, { useEffect, useRef } from 'react';
import {
	Animated,
	Image,
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { haptics } from '../../game/feedback';

export default function InputRow({
	value,
	onChangeText,
	suggestions,
	onPickSuggestion,
	disabled,
}) {
	const blinkAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(blinkAnim, {
					toValue: 0.3,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(blinkAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
			])
		);
		loop.start();
		return () => loop.stop();
	}, [blinkAnim]);

	const handleSubmit = () => {
		if (suggestions && suggestions[0]) {
			onPickSuggestion(suggestions[0]);
			Keyboard.dismiss();
		}
	};

	return (
		<View style={styles.wrap}>
			<View style={styles.inputRow}>
				<Animated.Text style={[styles.prefix, { opacity: blinkAnim }]}>
					▶
				</Animated.Text>
				<TextInput
					style={styles.input}
					placeholder="DIGITE O NOME..."
					placeholderTextColor={colors.txtFaint}
					value={value}
					onChangeText={onChangeText}
					onSubmitEditing={handleSubmit}
					editable={!disabled}
					autoCapitalize="characters"
					autoCorrect={false}
					returnKeyType="done"
				/>
			</View>

			{suggestions && suggestions.length > 0 && (
				<View style={styles.suggest}>
					{suggestions.map((s, idx) => (
						<Pressable
							key={s.key || s._apiId || idx}
							onPress={() => {
								haptics.tap();
								onPickSuggestion(s);
								Keyboard.dismiss();
							}}
							style={({ pressed }) => [
								styles.suggestItem,
								idx === suggestions.length - 1 && { borderBottomWidth: 0 },
								pressed && styles.suggestItemActive,
							]}
						>
							<Image
								source={{ uri: s.img_poke }}
								style={styles.suggestSprite}
								resizeMode="contain"
							/>
							<Text
								style={styles.suggestText}
								numberOfLines={1}
								adjustsFontSizeToFit
								minimumFontScale={0.6}
								allowFontScaling={false}
							>
								{(s.nome || '').toUpperCase()}
							</Text>
						</Pressable>
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		position: 'relative',
		zIndex: 20,
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: colors.bgInput,
		borderWidth: 2,
		borderBottomWidth: 4,
		borderColor: colors.line,
		borderRadius: 2,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	prefix: {
		color: colors.accent,
		fontFamily: fonts.pixel,
		fontSize: 14,
	},
	input: {
		flex: 1,
		color: colors.txt,
		fontFamily: fonts.pixel,
		fontSize: 14,
		letterSpacing: 1,
		paddingVertical: 8,
	},
	suggest: {
		position: 'absolute',
		top: '100%',
		marginTop: 4,
		left: 0,
		right: 0,
		backgroundColor: colors.bgMid,
		borderWidth: 2,
		borderBottomWidth: 3,
		borderColor: colors.line,
		borderRadius: 2,
		zIndex: 30,
		elevation: 30,
		overflow: 'hidden',
	},
	suggestItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderBottomWidth: 1,
		borderBottomColor: colors.lineSoft,
	},
	suggestItemActive: {
		backgroundColor: colors.bgCell,
	},
	suggestSprite: {
		width: 32,
		height: 32,
	},
	suggestText: {
		flex: 1,
		color: colors.txt,
		fontFamily: fonts.pixel,
		fontSize: 12,
		letterSpacing: 1,
	},
});
