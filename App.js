import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, Button } from 'react-native';
import { FilterPoke } from './src/functions/filter-poke';
import FilterPokes from './src/components/filter-pokes';
import Header from './src/components/header';
import Search from './src/components/search';
import Body from './src/components/body';
import { PokemonProvider } from './src/context/PokemonContext';
import { useChosenPoke } from './src/functions/chosen-poke/index';

export default function App() {
	const [filteredPokemons, setFilteredPokemons] = useState([]);
	const [pokeTerm, setPokeTerm] = useState('');
	const [randomPokemon, setRandomPokemon] = useState(null);

	useEffect(() => {
		useChosenPoke(setRandomPokemon);
	}, [useChosenPoke]);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons);
	}, [pokeTerm]);

	return (
		<View style={styles.container}>
			<Header />
			<Search />
			<TextInput
				style={styles.input}
				placeholder="Nome do Pokémon..."
				value={pokeTerm}
				onChangeText={setPokeTerm}
			/>
			{/* Componente onde mostra os pokémons sugeridos de acordo com o input do usuário */}
			<FilterPokes filteredPokemons={filteredPokemons} />
			<Body />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 5,
		backgroundColor: '#7971A0',
		alignItems: 'center',
	},

	input: {
		height: 50,
		margin: 12,
		borderWidth: 0.5,
		width: 286,
		padding: 10,
		backgroundColor: '#ffff',
		borderRadius: 8,
	},
});
