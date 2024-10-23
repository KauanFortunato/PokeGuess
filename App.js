import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, Button } from 'react-native';
import { FilterPoke } from './src/firebase/api/filter-poke';
import FilterPokes from './src/components/filter-pokes/index';
import Header from './src/components/header';
import Search from './src/components/search';
import Body from './src/components/body';
import { useChosenPoke } from './src/functions/chosen-poke/index';

export default function App() {
	const [filteredPokemons, setFilteredPokemons] = useState([]); // Pokémons filtrados da base de dados
	const [pokeTerm, setPokeTerm] = useState(''); // Variavel onde é guardado qual o pokémon que a pessoa está digitando
	const [randomPokemon, setRandomPokemon] = useState(null); // Variavel onde o pokemon randomizado é guardado

	useEffect(() => {
		useChosenPoke(setRandomPokemon); // Essa função é chamada toda vez que a pessoa atualiza o app
	}, [useChosenPoke]);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons); // Essa função é chamada toda vez que a pessoa atualiza o app
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

			{/* Pode tirar se necessário */}
			{randomPokemon && (
				<View>
					<Text>Nome: {randomPokemon.nome}</Text>
					<Text>Tipo 1: {randomPokemon.tipo1}</Text>
					<Text>Tipo 2: {randomPokemon.tipo2}</Text>
					<Text>Cor: {randomPokemon.cor}</Text>
					<Text>Habitat: {randomPokemon.habitat}</Text>

					<Button
						title="Sortear Pokémon"
						onPress={() => useChosenPoke(setRandomPokemon)}
					></Button>
				</View>
			)}
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
