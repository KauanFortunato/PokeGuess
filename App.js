import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Header from './src/components/header';
import Body from './src/components/body';

export default function App() {
	const [pokemon, setPokemon] = useState(null);

	// Sortear Pokémon da base de dados
	const chosenPoke = () => {
		fetch('http://10.0.0.3/PokeGuess/php/api/random-poke.php') // Lembrar de colocar o ip do pc (ipv4)
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'sorteado') {
					console.log('Pokémon sorteado com sucesso');
					setPokemon(data.pokemon);
				} else {
					Alert.alert('Erro', 'Não foi possível sortear o Pokémon.');
				}
			})
			.catch((error) => {
				console.error('Erro na requisição:', error);
				Alert.alert('Erro', 'Falha ao conectar com o servidor.');
			});
	};

	useEffect(() => {
		chosenPoke();
	}, []);

	return (
		<View style={styles.container}>
			<Header />
			<Body />
			{pokemon && (
				<View style={styles.container}>
					<Text>Nome: {pokemon.nome}</Text>
					<Text>Tipo1: {pokemon.tipo1}</Text>
					<Text>Tipo2: {pokemon.tipo2}</Text>
					<Text>habitat: {pokemon.habitat}</Text>
					<Text>cor: {pokemon.cor}</Text>
					<Text>Evolucao: {pokemon.numero_evolucao}</Text>
					<Text>Altura: {pokemon.altura}</Text>
					<Text>Peso: {pokemon.peso}</Text>

					{pokemon.imagem_base64 && (
						<Image
							source={{ uri: `data:image/jpeg;base64,${pokemon.imagem_base64}` }}
							style={{ width: 180, height: 180 }}
						/>
					)}
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
		justifyContent: 'center',
	},
});
