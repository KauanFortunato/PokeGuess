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
		padding: 10,
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
