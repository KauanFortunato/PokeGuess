import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList, Button } from 'react-native';
import { FilterPoke } from './src/firebase/api/filter-poke';
import FilterPokes from './src/components/filter-pokes/index';
import Header from './src/components/header';
import Search from './src/components/search';
import Body from './src/components/body';
import { useChosenPoke } from './src/functions/chosen-poke/index';
import { comparePokemons } from './src/firebase/api/compare-poke/index';

export default function App() {
	const [filteredPokemons, setFilteredPokemons] = useState([]); // Pokémons filtrados da base de dados
	const [pokeTerm, setPokeTerm] = useState(''); // Variavel onde é guardado qual o pokémon que a pessoa está digitando
	const [randomPokemon, setRandomPokemon] = useState(null); // Variavel onde o pokemon randomizado é guardado
	const [comparisonResult, setComparisonResult] = useState(''); // Variável para armazenar o resultado da comparação
	const [pokemonGuesses, setpokemonGuesses] = useState([]);

	useEffect(() => {
		useChosenPoke(setRandomPokemon); // Essa função é chamada toda vez que a pessoa atualiza o app
	}, [useChosenPoke]);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons); // Essa função é chamada toda vez que a pessoa atualiza o pokeTerm
	}, [pokeTerm]);

	const handleComparison = () => {
		if (randomPokemon) {
			const result = comparePokemons(pokeTerm, randomPokemon);
			setComparisonResult(result);
		}
	};

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
			<FilterPokes
				filteredPokemons={filteredPokemons}
				pokeTerm={pokeTerm}
				setPokeTerm={setPokeTerm}
				randomPokemon={randomPokemon}
				setpokemonGuesses={setpokemonGuesses}
				pokemonGuesses={pokemonGuesses}
			/>

			{/* Pode tirar se necessário */}
			{/* {randomPokemon && (
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
					<Button title="Enviar" onPress={handleComparison} />
				</View>
			)} */}
			<Body pokemonGuesses={pokemonGuesses} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 2,
		backgroundColor: '#7971A0',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		height: 50,
		margin: 10,
		borderWidth: 0.5,
		width: 330,
		padding: 10,
		marginBottom: 2,
		backgroundColor: '#ffff',
		borderRadius: 8,
	},
});
