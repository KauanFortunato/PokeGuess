import { View, Image, Text, FlatList } from 'react-native';
import styles from './styles';

export default function FilterPokes(props) {
	return (
		<FlatList
			data={props.filteredPokemons}
			keyExtractor={(item, index) => index.toString()}
			renderItem={({ item }) => (
				<View>
					<Image style={styles.searchImgPoke} source={{ uri: `${item.img_poke}` }} />
					<Text style={{ fontSize: 18, marginBottom: 10 }}>{item.nome}</Text>
				</View>
			)}
		/>
	);
}
