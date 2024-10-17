import React from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	setSearchText,
	searchText,
	TextInput,
	Text,
} from 'react-native';
import styles from './styles';

const Body = () => {
	return (
		<View style={styles.container}>
			<View style={styles.container_search}>
				<Text style={styles.search_title}>Qual é o Pokémon?</Text>

				<Text style={styles.attemptsText}>Tentativas: 1</Text>
			</View>
		</View>
	);
};

export default Body;
