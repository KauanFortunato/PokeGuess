import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

const Header = () => {
	return (
		<View style={styles.container}>
			<View style={styles.container_help}>
				<TouchableOpacity style={styles.button_help}>
					<Text style={styles.button_helpText}>?</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.container_logo}>
				<Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
			</View>
		</View>
	);
};

export default Header;
