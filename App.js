import { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	StatusBar,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { FilterPoke } from './src/firebase/api/filter-poke';
import FilterPokes from './src/components/filter-pokes/index';
import Header from './src/components/header';
import Search from './src/components/search';
import Body from './src/components/body';
import { useChosenPoke } from './src/functions/chosen-poke/index';
import { comparePokemons } from './src/firebase/api/compare-poke/index';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App() {
	const [filteredPokemons, setFilteredPokemons] = useState([]); // Pokémons filtrados da base de dados
	const [pokeTerm, setPokeTerm] = useState(''); // Variável onde é guardado qual o pokémon que a pessoa está digitando
	const [randomPokemon, setRandomPokemon] = useState(null); // Variável onde o pokemon randomizado é guardado
	const [pokemonGuesses, setPokemonGuesses] = useState([]); // Variável onde ficam os pokémons já tentados

	useEffect(() => {
		console.log(randomPokemon);
	}, [randomPokemon]);

	useEffect(() => {
		useChosenPoke(setRandomPokemon); // Essa função é chamada toda vez que a pessoa atualiza o app
	}, [useChosenPoke]);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons); // Essa função é chamada toda vez que a pessoa atualiza o pokeTerm
	}, [pokeTerm]);

	return (
		<KeyboardAvoidingView
			keyboardShouldPersistTaps="handled"
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
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
				setpokemonGuesses={setPokemonGuesses}
				pokemonGuesses={pokemonGuesses}
			/>
			<Body pokemonGuesses={pokemonGuesses} />
			<StatusBar barStyle="light-content" backgroundColor="#4B3F67" />
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
});
