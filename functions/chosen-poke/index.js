import { Alert } from 'react-native';

// Sortear Pokémon da base de dados
export const chosenPoke = (setPokemon) => {
	fetch('http://10.0.0.3/PokeGuess/php/api/random-poke.php') // Lembre-se de usar o IP correto
		.then((response) => response.json())
		.then((data) => {
			// Verifica se a resposta foi bem-sucedida
			if (data.status === 'sorteado') {
				console.log('Pokémon sorteado com sucesso:', data.pokemon);
				setPokemon(data.pokemon); // Corrige para acessar data.pokemon
			} else {
				Alert.alert('Erro', 'Não foi possível sortear o Pokémon.');
			}
		})
		.catch((error) => {
			console.error('Erro na requisição:', error);
			Alert.alert('Erro', 'Falha ao conectar com o servidor.');
		});
};
