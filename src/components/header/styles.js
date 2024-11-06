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
		width: 330,
		height: 240,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		position: 'relative',
	},
	modalText: {
		marginTop: 22,
		fontSize: 14,
		textAlign: 'center',
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
});

export default styles;
