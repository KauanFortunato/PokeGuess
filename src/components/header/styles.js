import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

const styles = StyleSheet.create({
	container: {
		height: '8%',
		width: '100%',
		marginTop: Platform.OS === 'ios' ? 44 : 0,
		borderBottomWidth: 0.9,
		borderBottomColor: '#111',
		justifyContent: 'center',
	},
	container_utility: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
	},
	button_help: {
		borderRadius: 50,
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		width: '60%',
		height: '100%',
		// padding: 24,
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'center',
	},
});

export default styles;
