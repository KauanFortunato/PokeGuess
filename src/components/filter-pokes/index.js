import React, { useEffect } from 'react';
import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import { comparePokemons } from '../../api/comparePoke';
import { fetchPokemonData } from '../../api/pokeApiService';

export default function FilterPokes(props) {
	useEffect(() => {
		console.log(props.randomPokemon);
	}, [props.pokemonGuesses]);

	async function pokemonChosen(item) {
		if (!props.randomPokemon) return;
		try {
			// item da lista tem apenas nome e sprite; busca dados completos antes de comparar
			const pokemon = item._apiId ? await fetchPokemonData(item._apiId) : item;
			const comparisionResult = comparePokemons(pokemon, props.randomPokemon);

			props.setpokemonGuesses([
				...props.pokemonGuesses,
				{ pokemon, comparision: comparisionResult },
			]);
			props.setPokeTerm('');
		} catch (error) {
			console.error('Erro ao selecionar Pokémon:', error);
		}
	}

	return (
		<View style={styles.suggestionsContainer}>
			<FlatList
				keyboardShouldPersistTaps="handled"
				data={props.filteredPokemons}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<View style={styles.searchblock}>
						<TouchableOpacity
							style={styles.buttonPokes}
							onPress={() => pokemonChosen(item)}
						>
							<Image style={styles.searchImgPoke} source={{ uri: item.img_poke }} />
							<Text style={styles.pokemonName}>{item.nome}</Text>
						</TouchableOpacity>
					</View>
				)}
				style={styles.flatList}
			/>
		</View>
	);
}
