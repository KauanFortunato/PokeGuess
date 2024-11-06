import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function WinContainer(props) {
	return (
		<View style={styles.containerWin}>
			<Text style={styles.textWin}>
				Você acertou {props.randomPokemon.nome} em {props.pokemonGuesses.length}{' '}
				tentativa(s)!
			</Text>
			<TouchableOpacity style={styles.buttonNewGame} onPress={props.resetApp}>
				<Text style={styles.textButton}>Novo Jogo</Text>
			</TouchableOpacity>
		</View>
	);
}
