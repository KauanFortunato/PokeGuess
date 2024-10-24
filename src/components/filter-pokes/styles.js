import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	suggestionsContainer: {
		maxHeight: 120,
		width: 330,
		borderRadius: 8,
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	flatList: {
		width: '100%',
	},
	searchblock: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	buttonPokes: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#D4D4D4',
	},
	searchImgPoke: {
		width: 40,
		height: 40,
		marginRight: 10,
	},
	pokemonName: {
		fontSize: 18,
		color: '#333',
	},
});

export default styles;
