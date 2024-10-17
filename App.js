import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList } from 'react-native';
import { chosenPoke } from './functions/chosen-poke';
// import SearchPoke from './src/components/search-poke';
import { FilterPoke } from './functions/filter-poke';
import FilterPokes from './src/components/filter-pokes';
import Header from './src/components/header';
import Body from './src/components/body';

export default function App() {
	const [pokemon, setPokemon] = useState(null);
	const [filteredPokemons, setFilteredPokemons] = useState([]);
	const [pokeTerm, setPokeTerm] = useState('');

	useEffect(() => {
		chosenPoke(setPokemon);
	}, []);

	useEffect(() => {
		FilterPoke(pokeTerm, setFilteredPokemons);
	}, [pokeTerm]);

	return (
		<View style={styles.container}>
			<Header />

			<TextInput
				style={styles.input}
				placeholder="Nome do Pokémon..."
				value={pokeTerm}
				onChangeText={setPokeTerm}
			/>
			{/* Esse componente é onde mostra os pokemons sugeridos de acordo com o input do user*/}
			<FilterPokes filteredPokemons={filteredPokemons} />

			<Body />

			{/* Não vamos usar essa parte do codigo, isto é só para debugar */}
			{pokemon && (
				<View style={styles.container}>
					{pokemon.imagem_base64 && (
						<Image
							source={{ uri: `data:image/jpeg;base64,${pokemon.imagem_base64}` }}
							style={{ width: 180, height: 180 }}
						/>
					)}

					<Text>Nome: {pokemon.nome}</Text>
					<Text>Tipo1: {pokemon.tipo1}</Text>
					<Text>Tipo2: {pokemon.tipo2}</Text>
					<Text>habitat: {pokemon.habitat}</Text>
					<Text>cor: {pokemon.cor}</Text>
					<Text>Evolucao: {pokemon.numero_evolucao}</Text>
					<Text>Altura: {pokemon.altura}</Text>
					<Text>Peso: {pokemon.peso}</Text>

					<StatusBar style="auto" />
				</View>
			)}
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
