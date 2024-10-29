import { View, Image, Text, Button } from 'react-native';
import styles from './styles';
import NetInfo from '@react-native-community/netinfo';

const ConectionFailed = () => {
	return (
		<View style={styles.container}>
			<Image
				source={require('../../.././assets/img/pokedex_offline.png')} // Caminho da imagem
				style={styles.image}
				resizeMode="contain"
			/>
			<Text style={styles.errorText}>Não conseguimos conectar à Pokédex</Text>
			<Button
				title="Tentar novamente"
				onPress={() => NetInfo.fetch().then((state) => setIsConnected(state.isConnected))}
			/>
		</View>
	);
};

export default ConectionFailed;
