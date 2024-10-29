import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, StatusBar, Image } from 'react-native';
import { FilterPoke } from './src/firebase/api/filter-poke';
import FilterPokes from './src/components/filter-pokes/index';
import Header from './src/components/header';
import Search from './src/components/search';
import Body from './src/components/body';
import ConectionFailed from './src/components/conection-failed';
import { useChosenPoke } from './src/functions/chosen-poke/index';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
	const [filteredPokemons, setFilteredPokemons] = useState([]); // Pokémons filtrados da base de dados
	const [pokeTerm, setPokeTerm] = useState(''); // Variavel onde é guardado qual o pokémon que a pessoa está digitando
	const [randomPokemon, setRandomPokemon] = useState(null); // Variavel onde o pokemon randomizado é guardado
	const [pokemonGuesses, setpokemonGuesses] = useState([]); // Variavel onde fica os pokemons já tentados
	const [isConnected, setIsConnected] = useState(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsConnected(state.isConnected);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		console.log(isConnected);
	}, [isConnected]);

	// useEffect(() => {
	// 	console.log(randomPokemon);
	// }, [randomPokemon]);

	useEffect(() => {
		useChosenPoke(setRandomPokemon); // Essa função é chamada toda vez que a pessoa atualiza o app
	}, [useChosenPoke]);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons); // Essa função é chamada toda vez que a pessoa atualiza o pokeTerm
	}, [pokeTerm]);

	if (isConnected) {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" backgroundColor="#4B3F67" />
				<ConectionFailed />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#4B3F67" />

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
	errorText: {
		fontSize: 18,
		color: 'red',
		marginBottom: 20,
	},
	image: {
		width: 200, // Ajuste o tamanho conforme necessário
		height: 200,
		marginBottom: 20,
	},
});
