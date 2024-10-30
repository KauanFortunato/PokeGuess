import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		fontSize: 24,
		color: 'white',
		marginBottom: 20,
		fontWeight: '700',
		textAlign: 'center',
	},
	containerImg: {
		width: '100%',
		height: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '80%',
		height: '30%',
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'center',
	},
	containerConection: {
		width: '100%',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		bottom: 50,
	},
	reconectButton: {
		backgroundColor: 'white',
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
	},
});

export default styles;
