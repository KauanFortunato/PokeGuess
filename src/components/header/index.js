import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

const Header = () => {
	return (
		<View style={styles.container}>
			<View style={styles.container_utility}>
				<TouchableOpacity style={styles.button_help}>
					<Feather name="help-circle" size={28} color="white" />
				</TouchableOpacity>

				<View style={styles.container_logo}>
					<Image
						source={require('../../../assets/img/logo.png')}
						style={styles.logo}
						resizeMode="contain"
					/>
				</View>

				<TouchableOpacity style={styles.button_help}>
					<Ionicons name="settings-sharp" size={28} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Header;
