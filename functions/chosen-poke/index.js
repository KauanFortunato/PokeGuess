import { Alert } from 'react-native';

// Sortear Pokémon da base de dados
export const chosenPoke = (setPokemon) => {
	fetch('http://192.168.1.91/PokeGuess/php/api/random-poke.php') // Lembrar de colocar o ip do pc (ipv4)
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
