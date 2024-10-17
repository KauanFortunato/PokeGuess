import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 2,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container_search: {
		width: '100%',
		alignItems: 'center',
		padding: 20,
	},
	search_title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		color: '#fffafa',
	},
	search: {
		width: '100%',
		height: 50,
		borderRadius: 15,
		borderColor: '#fffafa',
		borderWidth: 1,
		paddingLeft: 20,
		fontSize: 16,
		backgroundColor: '#fffafa',
		textAlign: 'center',
	},
	attemptsText: {
		marginTop: 10,
		fontSize: 14,
		color: '#fffafa',
	},
});

export default styles;
