import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme/tokens';
import { FilterPoke } from '../../api/filterPoke';
import { fetchPokemonData } from '../../api/pokeApiService';
import { haptics } from '../../game/feedback';
import Board from './Board';
import InputRow from './InputRow';

const FLIP_ANIM_DURATION = 6 * 180 + 500;
const HINT_THRESHOLD = 10;

function buildHintOrder(singleGenMode) {
	return [
		singleGenMode
			? { key: 'evolucao', label: 'EVO' }
			: { key: 'geracao', label: 'GERAÇÃO' },
		{ key: 'tipos', label: 'TIPO' },
		{ key: 'cor', label: 'COR' },
		{ key: 'habitat', label: 'HABITAT' },
	];
}

function getHintValue(target, key) {
	if (key === 'tipos') return (target.tipos || []).join('/');
	if (key === 'evolucao') return `Estágio ${target.evolucao ?? 1}`;
	if (key === 'geracao') return `${target.geracao}`;
	return target[key] || '';
}

function HintPulse({ active, children }) {
	const pulse = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		if (!active) {
			pulse.setValue(0);
			return;
		}
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, {
					toValue: 1,
					duration: 700,
					useNativeDriver: false,
				}),
				Animated.timing(pulse, {
					toValue: 0,
					duration: 700,
					useNativeDriver: false,
				}),
			])
		);
		loop.start();
		return () => loop.stop();
	}, [active, pulse]);

	const shadowOpacity = pulse.interpolate({
		inputRange: [0, 1],
		outputRange: [0.25, 0.85],
	});

	return (
		<Animated.View
			style={{
				shadowColor: '#ffd23f',
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity: active ? shadowOpacity : 0,
				shadowRadius: 10,
			}}
		>
			{children}
		</Animated.View>
	);
}

export default function GameScreen({
	target,
	mode,
	gens,
	muted,
	onWin,
	onLose,
	onOpenSettings,
}) {
	const [term, setTerm] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [guesses, setGuesses] = useState([]);
	const [animatingIndex, setAnimatingIndex] = useState(-1);
	const [busy, setBusy] = useState(false);
	const [revealedHints, setRevealedHints] = useState([]);
	const enterOp = useRef(new Animated.Value(0)).current;
	const enterScale = useRef(new Animated.Value(0.96)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(enterOp, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),
			Animated.spring(enterScale, {
				toValue: 1,
				friction: 6,
				tension: 70,
				useNativeDriver: true,
			}),
		]).start();
	}, [enterOp, enterScale]);

	const maxGuesses = mode?.maxGuesses ?? Infinity;
	const isInfinite = !Number.isFinite(maxGuesses);
	const hintsAllowed = mode?.key !== 'nightmare';
	const singleGenMode = Array.isArray(gens) && gens.length === 1;
	const hintOrder = useMemo(() => buildHintOrder(singleGenMode), [singleGenMode]);
	const canHint =
		hintsAllowed &&
		guesses.length >= HINT_THRESHOLD &&
		revealedHints.length < hintOrder.length;

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			if (!term) {
				setSuggestions([]);
				return;
			}
			const guessedKeys = new Set(guesses.map((g) => g.key));
			await FilterPoke(
				term,
				(items) => {
					if (cancelled) return;
					setSuggestions(items.filter((p) => !guessedKeys.has(p.key)).slice(0, 5));
				},
				gens
			);
		};
		run();
		return () => {
			cancelled = true;
		};
	}, [term, guesses, gens]);

	const submit = async (suggestion) => {
		if (busy) return;
		setBusy(true);
		setTerm('');
		setSuggestions([]);
		haptics.medium();
		try {
			const full = await fetchPokemonData(suggestion._apiId || suggestion.key);
			const nextGuesses = [...guesses, full];
			const idx = nextGuesses.length - 1;
			setGuesses(nextGuesses);
			setAnimatingIndex(idx);

			setTimeout(() => {
				setAnimatingIndex(-1);
				setBusy(false);
				if (full.key === target.key) {
					onWin(nextGuesses);
				} else if (!isInfinite && nextGuesses.length >= maxGuesses) {
					onLose(nextGuesses);
				}
			}, FLIP_ANIM_DURATION);
		} catch (err) {
			console.error('Erro ao submeter palpite:', err);
			setBusy(false);
		}
	};

	const revealHint = () => {
		if (!canHint) return;
		haptics.light();
		setRevealedHints((prev) => {
			const nextKey = hintOrder[prev.length].key;
			return [...prev, nextKey];
		});
	};

	const baseHint = useMemo(() => {
		if (isInfinite) {
			return guesses.length === 0
				? 'Modo infinito — boa sorte!'
				: 'Use as dicas das colunas...';
		}
		const remaining = maxGuesses - guesses.length;
		if (guesses.length === 0) return 'Comece com qualquer criatura';
		if (guesses.length === 1) return 'Use as dicas das colunas...';
		if (guesses.length === 2)
			return 'Verde = certo, Amarelo = perto, Vermelho = errado';
		if (remaining === 1) return 'ÚLTIMA CHANCE!';
		return `${remaining} tentativas restantes`;
	}, [guesses.length, isInfinite, maxGuesses]);

	const renderHintBar = () => {
		if (canHint || revealedHints.length > 0) {
			const remainingHints = hintOrder.length - revealedHints.length;
			return (
				<HintPulse active={canHint}>
					<Pressable
						onPress={revealHint}
						disabled={!canHint}
						style={({ pressed }) => [
							styles.hintBar,
							styles.hintActive,
							pressed && canHint && styles.hintPressed,
						]}
					>
						<View style={styles.hintLabelBox}>
							<Text style={styles.hintLabel}>★ DICA</Text>
						</View>
						<View style={styles.hintTextWrap}>
							{revealedHints.length === 0 ? (
								<Text style={styles.hintCTA}>▶ TOCAR PARA REVELAR</Text>
							) : (
								<View>
									{revealedHints.map((k) => {
										const info = hintOrder.find((h) => h.key === k);
										return (
											<Text
												key={k}
												style={styles.hintLine}
												numberOfLines={1}
												adjustsFontSizeToFit
												minimumFontScale={0.6}
												allowFontScaling={false}
											>
												<Text style={styles.hintLineLabel}>{info.label}: </Text>
												<Text style={styles.hintLineValue}>
													{getHintValue(target, k)}
												</Text>
											</Text>
										);
									})}
								</View>
							)}
						</View>
						{canHint && (
							<View style={styles.hintBadge}>
								<Text style={styles.hintBadgeText}>+{remainingHints}</Text>
							</View>
						)}
					</Pressable>
				</HintPulse>
			);
		}
		return (
			<View style={styles.hintBar}>
				<View style={styles.hintLabelBox}>
					<Text style={styles.hintLabel}>DICA</Text>
				</View>
				<Text style={styles.hintText} numberOfLines={2}>
					{baseHint}
				</Text>
			</View>
		);
	};

	return (
		<SafeAreaView edges={['top']} style={styles.safe}>
			<Animated.View
				style={[
					styles.screen,
					{ opacity: enterOp, transform: [{ scale: enterScale }] },
				]}
			>
				<View style={styles.head}>
					<Pressable
						onPress={() => {
							haptics.tap();
							onOpenSettings();
						}}
						style={({ pressed }) => [
							styles.iconBtn,
							pressed && styles.iconBtnPressed,
						]}
					>
						<Text style={styles.iconText}>⌗</Text>
					</Pressable>

					<View style={styles.titleWrap}>
						<View style={styles.titleRow}>
							<Text style={styles.titlePixel}>POKE</Text>
							<Text style={[styles.titlePixel, styles.titleAccent]}>GUESS</Text>
						</View>
						<Text style={styles.sub}>
							CHUTES: {guesses.length}
							{isInfinite ? '' : `/${maxGuesses}`}
						</Text>
					</View>

					<View style={styles.modeBadge}>
						<Text style={styles.modeBadgeText}>{mode?.sub ?? '∞'}</Text>
					</View>
				</View>

				{renderHintBar()}

				<View style={styles.inputZone}>
					<InputRow
						value={term}
						onChangeText={setTerm}
						suggestions={suggestions}
						onPickSuggestion={submit}
						disabled={busy}
					/>
				</View>

				<ScrollView
					style={styles.boardScroll}
					contentContainerStyle={styles.boardContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Board
						guesses={guesses}
						target={target}
						animatingIndex={animatingIndex}
						maxGuesses={maxGuesses}
						singleGenMode={singleGenMode}
					/>
				</ScrollView>
			</Animated.View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.bgDeep,
	},
	screen: {
		flex: 1,
		paddingHorizontal: 10,
		paddingTop: 8,
		paddingBottom: 8,
	},
	head: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 4,
		paddingBottom: 10,
		borderBottomWidth: 2,
		borderBottomColor: colors.lineSoft,
		gap: 8,
	},
	iconBtn: {
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
	iconBtnPressed: {
		borderBottomWidth: 2,
		transform: [{ translateY: 1 }],
	},
	iconText: {
		color: colors.txt,
		fontFamily: fonts.pixel,
		fontSize: 16,
	},
	titleWrap: {
		alignItems: 'center',
		flex: 1,
	},
	titleRow: {
		flexDirection: 'row',
	},
	titlePixel: {
		fontFamily: fonts.pixel,
		fontSize: 16,
		letterSpacing: 1,
		color: colors.txt,
	},
	titleAccent: {
		color: colors.accent,
		marginLeft: 2,
	},
	sub: {
		fontFamily: fonts.mono,
		fontSize: 16,
		color: colors.txtDim,
		letterSpacing: 2,
		marginTop: 4,
	},
	modeBadge: {
		minWidth: 36,
		height: 36,
		backgroundColor: colors.bgCard,
		borderWidth: 2,
		borderBottomWidth: 3,
		borderColor: colors.accent,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 2,
		paddingHorizontal: 6,
	},
	modeBadgeText: {
		fontFamily: fonts.pixel,
		fontSize: 12,
		color: colors.accent,
	},
	hintBar: {
		marginTop: 8,
		paddingVertical: 8,
		paddingHorizontal: 10,
		backgroundColor: colors.bgMid,
		borderWidth: 1,
		borderColor: colors.lineSoft,
		borderRadius: 2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		minHeight: 44,
	},
	hintActive: {
		borderColor: colors.accent,
		borderWidth: 2,
		backgroundColor: colors.bgCard,
	},
	hintPressed: {
		backgroundColor: colors.bgCell,
	},
	hintLabelBox: {
		backgroundColor: colors.bgDeep,
		paddingHorizontal: 6,
		paddingVertical: 4,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: colors.accent,
	},
	hintLabel: {
		color: colors.accent,
		fontFamily: fonts.pixel,
		fontSize: 9,
		letterSpacing: 1,
	},
	hintTextWrap: {
		flex: 1,
	},
	hintText: {
		flex: 1,
		color: colors.txt,
		fontFamily: fonts.mono,
		fontSize: 16,
	},
	hintCTA: {
		color: colors.accent,
		fontFamily: fonts.pixel,
		fontSize: 10,
		letterSpacing: 1,
	},
	hintLine: {
		fontFamily: fonts.mono,
		fontSize: 16,
		lineHeight: 18,
	},
	hintLineLabel: {
		color: colors.accentPink,
		fontFamily: fonts.pixel,
		fontSize: 8,
		letterSpacing: 1,
	},
	hintLineValue: {
		color: colors.txt,
	},
	hintBadge: {
		backgroundColor: colors.accent,
		borderWidth: 1,
		borderColor: colors.bgDeep,
		borderBottomWidth: 2,
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 2,
		minWidth: 26,
		alignItems: 'center',
	},
	hintBadgeText: {
		color: colors.bgDeep,
		fontFamily: fonts.pixel,
		fontSize: 10,
		letterSpacing: 1,
	},
	inputZone: {
		marginTop: 10,
		zIndex: 20,
	},
	boardScroll: {
		flex: 1,
		marginTop: 8,
	},
	boardContent: {
		paddingBottom: 8,
	},
});
