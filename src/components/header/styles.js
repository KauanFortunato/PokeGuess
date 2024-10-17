import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		height: 80,
		width: '100%',
		marginTop: '8%',
		borderBottomWidth: 0.8,
		borderBottomColor: '#fffafa',
	},
	container_help: {
		width: '100%',
		flex: 2,
		alignItems: 'flex-start',
		margin: 5,
	},
	button_help: {
		width: 20,
		height: 20,
		borderRadius: 20,
		backgroundColor: '#rgba(255, 255, 255, .1)',
		borderColor: '#fffafa',
		borderWidth: 1.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button_helpText: {
		textAlign: 'center',
		fontSize: 12,
		color: '#fff',
		fontWeight: 'bold',
	},
	container_logo: {
		flex: 4,
		margin: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		width: '50%',
		height: 'auto',
		padding: 25,
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'center',
	},
});

export default styles;
