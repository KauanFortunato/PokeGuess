import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { FilterPoke } from './src/firebase/api/filter-poke';
import FilterPokes from './src/components/filter-pokes/index';
import Header from './src/components/header';
import Search from './src/components/search';
import Body from './src/components/body';
import WinContainer from './src/components/win-container';
import { useChosenPoke } from './src/functions/chosen-poke/index';

export default function App() {
	const [filteredPokemons, setFilteredPokemons] = useState([]); // Pokémons filtrados da base de dados
	const [pokeTerm, setPokeTerm] = useState(''); // Variável onde é guardado qual o pokémon que a pessoa está digitando
	const [randomPokemon, setRandomPokemon] = useState(null); // Variável onde o pokemon randomizado é guardado
	const [pokemonGuesses, setPokemonGuesses] = useState([]); // Variável onde ficam os pokémons já tentados
	const [win, setWin] = useState(false);

	useEffect(() => {
		useChosenPoke(setRandomPokemon); // Essa função é chamada toda vez que a pessoa atualiza o app
	}, [useChosenPoke]);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons); // Essa função é chamada toda vez que a pessoa atualiza o pokeTerm
	}, [pokeTerm]);

	useEffect(() => {
		if (randomPokemon !== null) {
			console.log('Random: ' + randomPokemon.nome);
			if (randomPokemon.nome === pokemonGuesses.at(-1).pokemon.nome) {
				setWin(true);
			}
		}
	}, [pokemonGuesses]);

	const resetApp = () => {
		setFilteredPokemons([]);
		setPokeTerm('');
		setRandomPokemon(null);
		setPokemonGuesses([]);
		setWin(false);
		useChosenPoke(setRandomPokemon);
	};

	return (
		<KeyboardAvoidingView
			keyboardShouldPersistTaps="handled"
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<Header />
			<Search />

			{!win ? (
				<TextInput
					style={styles.input}
					placeholder="Nome do Pokémon..."
					value={pokeTerm}
					onChangeText={setPokeTerm}
				/>
			) : (
				<WinContainer
					pokemonGuesses={pokemonGuesses}
					randomPokemon={randomPokemon}
					resetApp={resetApp}
				/>
			)}

			{/* Componente onde mostra os pokémons sugeridos de acordo com o input do usuário */}
			<FilterPokes
				filteredPokemons={filteredPokemons}
				pokeTerm={pokeTerm}
				setPokeTerm={setPokeTerm}
				randomPokemon={randomPokemon}
				setpokemonGuesses={setPokemonGuesses}
				pokemonGuesses={pokemonGuesses}
			/>
			<Body pokemonGuesses={pokemonGuesses} />
			<StatusBar barStyle="light-content" backgroundColor="#000" />
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#7971A0',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		height: 50,
		width: 330,
		margin: 5,
		borderWidth: 0.5,
		padding: 10,
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
