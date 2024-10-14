import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchPoke(pokeTerm, setPokeTerm) {
	return (
		<View style={styles.view}>
			<TextInput
				style={styles.input}
				placeholder="Nome do Pokémon..."
				value={pokeTerm}
				onChangeText={setPokeTerm}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 50,
		margin: 12,
		borderWidth: 0.5,
		width: 286,
		padding: 10,
		backgroundColor: '#ffff',
		borderRadius: 8,
	},

	view: {
		marginTop: 100,
	},
});
