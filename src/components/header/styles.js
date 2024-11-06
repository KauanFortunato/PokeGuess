import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		height: height * 0.1,
		width: '100%',
		borderBottomWidth: 0.9,
		borderBottomColor: '#111',
		justifyContent: 'center',
		alignContent: 'center',
		flexShrink: 0,
	},
	container_utility: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	button_help: {
		position: 'absolute',
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container_logo: {
		flex: 1,
		alignItems: 'center',
	},
	logo: {
		width: '50%',
		height: '70%',
		resizeMode: 'contain',
	},
	// Estilos do Modal
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '90%',
		height: '40%',
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalText: {
		marginTop: 10,
		fontSize: 14,
		textAlign: 'center',
	},
	helpImage: {
		width: 300,
		height: 80,
		borderRadius: 10,
		borderColor: 'black',
		borderWidth: 2,
		marginTop: 20,
	},
	closeButton: {
		position: 'absolute',
		top: 10,
		right: 10,
	},
	darkModeContainer: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	titleHelp: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	subTitleHelp: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 20,
	},
	colorLegendContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginTop: 0,
	},

	colorBoxContainer: {
		alignItems: 'center',
	},
	colorBox: {
		width: 20,
		height: 20,
		borderRadius: 5,
		marginBottom: 5,
	},

	colorLabel: {
		fontSize: 12,
		textAlign: 'center',
	},
});

export default styles;
