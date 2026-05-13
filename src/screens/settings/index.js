import React, { useMemo, useState } from 'react';
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { MODES, MODE_ORDER } from '../../game/modes';
import { ALL_GENS } from '../../game/gens';

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;
	const sa = [...a].sort();
	const sb = [...b].sort();
	return sa.every((v, i) => v === sb[i]);
}

export default function SettingsModal({
	visible,
	initialMode,
	initialGens,
	initialMuted,
	inGame,
	onApply,
	onGiveUp,
	onBackToMenu,
	onClose,
}) {
	const [mode, setMode] = useState(initialMode);
	const [gens, setGens] = useState(initialGens);
	const [muted, setMutedLocal] = useState(initialMuted);

	React.useEffect(() => {
		if (visible) {
			setMode(initialMode);
			setGens(initialGens);
			setMutedLocal(initialMuted);
		}
	}, [visible, initialMode, initialGens, initialMuted]);

	const toggleGen = (g) => {
		setGens((prev) => {
			if (prev.includes(g)) {
				const next = prev.filter((x) => x !== g);
				return next.length === 0 ? [g] : next;
			}
			return [...prev, g].sort();
		});
	};

	const toggleAll = () => {
		setGens((prev) =>
			arraysEqual(prev, ALL_GENS) ? [1] : [...ALL_GENS]
		);
	};

	const allSelected = useMemo(() => arraysEqual(gens, ALL_GENS), [gens]);
	const dirty =
		mode !== initialMode ||
		!arraysEqual(gens, initialGens) ||
		muted !== initialMuted;

	const apply = () => {
		onApply({ mode, gens, muted });
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<View style={styles.header}>
						<Text style={styles.title}>AJUSTES</Text>
						<Pressable onPress={onClose} hitSlop={10}>
							<Text style={styles.close}>✕</Text>
						</Pressable>
					</View>

					<ScrollView contentContainerStyle={styles.body}>
						<Text style={styles.section}>MODO</Text>
						<View style={styles.modes}>
							{MODE_ORDER.map((k) => {
								const m = MODES[k];
								const selected = mode === k;
								return (
									<Pressable
										key={k}
										onPress={() => setMode(k)}
										style={({ pressed }) => [
											styles.modeBtn,
											selected && styles.modeBtnSelected,
											pressed && styles.btnPressed,
										]}
									>
										<Text
											style={[
												styles.modeBtnLabel,
												selected && styles.modeBtnLabelSelected,
											]}
										>
											{m.label}
										</Text>
										<Text
											style={[
												styles.modeBtnSub,
												selected && styles.modeBtnSubSelected,
											]}
										>
											{m.sub}
										</Text>
									</Pressable>
								);
							})}
						</View>

						<Text style={[styles.section, { marginTop: 18 }]}>GERAÇÕES</Text>
						<View style={styles.gens}>
							{ALL_GENS.map((g) => {
								const selected = gens.includes(g);
								return (
									<Pressable
										key={g}
										onPress={() => toggleGen(g)}
										style={({ pressed }) => [
											styles.genBtn,
											selected && styles.genBtnSelected,
											pressed && styles.btnPressed,
										]}
									>
										<Text
											style={[
												styles.genBtnText,
												selected && styles.genBtnTextSelected,
											]}
										>
											{g}
										</Text>
									</Pressable>
								);
							})}
						</View>
						<Pressable
							onPress={toggleAll}
							style={({ pressed }) => [
								styles.allBtn,
								allSelected && styles.allBtnSelected,
								pressed && styles.btnPressed,
							]}
						>
							<Text
								style={[
									styles.allBtnText,
									allSelected && styles.allBtnTextSelected,
								]}
							>
								{allSelected ? '✓ TODAS' : 'TODAS'}
							</Text>
						</Pressable>

						<Text style={[styles.section, { marginTop: 22 }]}>SOM / VIBRAÇÃO</Text>
						<Pressable
							onPress={() => setMutedLocal((v) => !v)}
							style={({ pressed }) => [
								styles.allBtn,
								!muted && styles.allBtnSelected,
								pressed && styles.btnPressed,
							]}
						>
							<Text
								style={[
									styles.allBtnText,
									!muted && styles.allBtnTextSelected,
								]}
							>
								{muted ? '✕ DESLIGADO' : '✓ LIGADO'}
							</Text>
						</Pressable>

						{inGame && (
							<>
								<Text style={[styles.section, { marginTop: 22, color: colors.miss }]}>
									EM JOGO
								</Text>
								<Pressable
									onPress={onGiveUp}
									style={({ pressed }) => [
										styles.actionBtn,
										styles.danger,
										pressed && styles.btnPressed,
									]}
								>
									<Text style={styles.actionBtnText}>DESISTIR</Text>
								</Pressable>
								<Pressable
									onPress={onBackToMenu}
									style={({ pressed }) => [
										styles.actionBtn,
										styles.secondary,
										pressed && styles.btnPressed,
									]}
								>
									<Text style={[styles.actionBtnText, { color: colors.txt }]}>
										VOLTAR AO MENU
									</Text>
								</Pressable>
							</>
						)}
					</ScrollView>

					<View style={styles.footer}>
						{dirty && (
							<Pressable
								onPress={apply}
								style={({ pressed }) => [
									styles.actionBtn,
									styles.primary,
									pressed && styles.btnPressed,
								]}
							>
								<Text style={styles.actionBtnText}>
									{inGame ? 'APLICAR E REINICIAR' : 'APLICAR'}
								</Text>
							</Pressable>
						)}
						<Pressable
							onPress={onClose}
							style={({ pressed }) => [
								styles.actionBtn,
								styles.secondary,
								pressed && styles.btnPressed,
							]}
						>
							<Text style={[styles.actionBtnText, { color: colors.txt }]}>
								{dirty ? 'CANCELAR' : 'FECHAR'}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(5, 4, 16, 0.85)',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	modal: {
		backgroundColor: colors.bgDeep,
		borderWidth: 3,
		borderColor: colors.accent,
		borderRadius: 4,
		width: '100%',
		maxWidth: 380,
		maxHeight: '92%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 2,
		borderBottomColor: colors.lineSoft,
	},
	title: {
		fontFamily: fonts.pixel,
		fontSize: 14,
		color: colors.accent,
		letterSpacing: 2,
	},
	close: {
		fontFamily: fonts.pixel,
		fontSize: 16,
		color: colors.txt,
		paddingHorizontal: 4,
	},
	body: {
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	section: {
		fontFamily: fonts.pixel,
		fontSize: 9,
		color: colors.accentPink,
		letterSpacing: 2,
		marginBottom: 10,
	},
	modes: {
		flexDirection: 'row',
		gap: 6,
	},
	modeBtn: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 4,
		backgroundColor: colors.bgCard,
		borderWidth: 2,
		borderBottomWidth: 4,
		borderColor: colors.lineSoft,
		borderRadius: 2,
		alignItems: 'center',
	},
	modeBtnSelected: {
		backgroundColor: colors.accent,
		borderColor: colors.bgDeep,
	},
	modeBtnLabel: {
		fontFamily: fonts.pixel,
		fontSize: 8,
		color: colors.txt,
		letterSpacing: 1,
	},
	modeBtnLabelSelected: {
		color: colors.bgDeep,
	},
	modeBtnSub: {
		fontFamily: fonts.mono,
		fontSize: 18,
		color: colors.txtDim,
		marginTop: 4,
	},
	modeBtnSubSelected: {
		color: colors.bgDeep,
	},
	gens: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	genBtn: {
		width: '22%',
		aspectRatio: 1.4,
		backgroundColor: colors.bgCard,
		borderWidth: 2,
		borderBottomWidth: 4,
		borderColor: colors.lineSoft,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	genBtnSelected: {
		backgroundColor: colors.accentMint,
		borderColor: colors.bgDeep,
	},
	genBtnText: {
		fontFamily: fonts.pixel,
		fontSize: 14,
		color: colors.txt,
	},
	genBtnTextSelected: {
		color: colors.bgDeep,
	},
	allBtn: {
		marginTop: 8,
		paddingVertical: 10,
		backgroundColor: colors.bgCard,
		borderWidth: 2,
		borderBottomWidth: 4,
		borderColor: colors.lineSoft,
		borderRadius: 2,
		alignItems: 'center',
	},
	allBtnSelected: {
		backgroundColor: colors.accentMint,
		borderColor: colors.bgDeep,
	},
	allBtnText: {
		fontFamily: fonts.pixel,
		fontSize: 10,
		color: colors.txt,
		letterSpacing: 2,
	},
	allBtnTextSelected: {
		color: colors.bgDeep,
	},
	actionBtn: {
		marginTop: 8,
		paddingVertical: 12,
		paddingHorizontal: 18,
		borderWidth: 2,
		borderBottomWidth: 4,
		borderColor: colors.bgDeep,
		borderRadius: 2,
		alignItems: 'center',
	},
	primary: {
		backgroundColor: colors.accent,
	},
	danger: {
		backgroundColor: colors.miss,
	},
	secondary: {
		backgroundColor: colors.bgCard,
		borderColor: colors.line,
	},
	actionBtnText: {
		fontFamily: fonts.pixel,
		fontSize: 10,
		color: colors.bgDeep,
		letterSpacing: 1,
	},
	btnPressed: {
		borderBottomWidth: 2,
		transform: [{ translateY: 2 }],
	},
	footer: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderTopWidth: 2,
		borderTopColor: colors.lineSoft,
	},
});
