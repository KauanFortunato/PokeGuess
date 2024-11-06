import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	containerWin: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 60,
		width: 330,
		margin: 5,
		backgroundColor: '#01D0C3',
		borderRadius: 8,
	},
	textWin: {
		width: '50%',
		textAlign: 'center',
		color: 'white',
		fontWeight: '700',
		fontSize: 15,
	},
	buttonNewGame: {
		width: '30%',
		backgroundColor: '#4B3F67',
		padding: 7,
		borderRadius: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	textButton: {
		textAlign: 'center',
		color: 'white',
		fontWeight: '800',
		fontSize: 15,
		margin: 0,
	},
});

export default styles;
