import React, { useRef } from 'react';
import { View, Image, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import styles from './styles';
import NetInfo from '@react-native-community/netinfo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const ConectionFailed = (props) => {
	return (
		<View style={styles.container}>
			<Image
				source={require('../../.././assets/img/pokedex_offline.png')} // Caminho da imagem
				style={styles.image}
				resizeMode="contain"
			/>

			<Text style={styles.errorText}>Ops... Não conseguimos conectar à Pokédex</Text>

			<View style={styles.containerConection}>
				<TouchableOpacity
					onPress={() =>
						NetInfo.fetch().then((state) => props.setIsConnected(state.isConnected))
					}
					style={styles.reconectButton}
				>
					<SimpleLineIcons name="reload" size={30} color="black" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ConectionFailed;
