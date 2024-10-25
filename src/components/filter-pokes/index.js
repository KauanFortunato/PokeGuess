import React, { useState, useEffect } from 'react';
import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import { comparePokemons } from '../../firebase/api/compare-poke';

export default function FilterPokes(props) {
	useEffect(() => {
		console.log(props.pokemonGuesses);
	}, [props.pokemonGuesses]);

	function pokemonChosen(item) {
		props.setPokeTerm(item.nome);
		const comparisionResult = comparePokemons(item, props.randomPokemon);

		props.setpokemonGuesses([
			...props.pokemonGuesses,
			{ pokemon: item, comparision: comparisionResult },
		]);

		// Limpa o campo de entrada
		props.setPokeTerm('');
	}

	return (
		<View style={styles.suggestionsContainer}>
			<FlatList
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
