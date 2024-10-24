import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, FlatList } from 'react-native';
import { chosenPoke } from './functions/chosen-poke';
// import SearchPoke from './src/components/search-poke';
import { FilterPoke } from './functions/filter-poke';
import FilterPokes from './src/components/filter-pokes';
import Header from './src/components/header';
import Search from './src/components/search';
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

			{/* Parte do código para debugar (se necessário) */}
			{/* {pokemon && (
				<View style={styles.debugContainer}>
					{pokemon.imagem_base64 && (
						<Image
							source={{ uri: `data:image/jpeg;base64,${pokemon.imagem_base64}` }}
							style={{ width: 180, height: 180 }}
						/>
					)}
					<Text>Nome: {pokemon.nome}</Text>
					<Text>Tipo 1: {pokemon.tipo1}</Text>
					<Text>Tipo 2: {pokemon.tipo2}</Text>
					<Text>Habitat: {pokemon.habitat}</Text>
					<Text>Cor: {pokemon.cor}</Text>
					<Text>Evolução: {pokemon.numero_evolucao}</Text>
					<Text>Altura: {pokemon.altura}</Text>
					<Text>Peso: {pokemon.peso}</Text>
				</View>
			)}
			<StatusBar style="auto" />*/}
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
