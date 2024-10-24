import { View, Image, Text, FlatList } from 'react-native';
import styles from './styles';

export default function FilterPokes(props) {
	return (
		<View style={styles.suggestionsContainer}>
			<FlatList
				data={props.filteredPokemons}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<View style={styles.searchblock}>
						<Image
							style={styles.searchImgPoke}
							source={{ uri: `data:image/png;base64,${item.imagem}` }}
						/>
						<Text style={styles.pokemonName}>{item.nome}</Text>
					</View>
				)}
				style={styles.flatList}
			/>
		</View>
	);
}
