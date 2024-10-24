import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function FilterPokes(props) {
	function pokemonChosen(pokemonName) {
		props.setPokeTerm(pokemonName);
	}

	return (
		<View style={styles.suggestionsContainer}>
			<FlatList
				data={props.filteredPokemons}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<View style={styles.searchblock}>
						<TouchableOpacity
							style={styles.buttonPokes}
							onPress={() => pokemonChosen(item.nome)}
						>
							<Image style={styles.searchImgPoke} source={{ uri: item.img_poke }} />
							<Text style={styles.pokemonName}>{item.nome}</Text>
						</TouchableOpacity>
					</View>
				)}
				style={styles.flatList}
			/>
		</View>
	);
}
