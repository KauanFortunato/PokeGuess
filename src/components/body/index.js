import React from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import styles from './styles';

const Body = ({ pokemonGuesses }) => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container_list}>
				{pokemonGuesses
					.slice()
					.reverse()
					.map((pokemon, index) => (
						<View key={index} style={styles.container_entreview}>
							<View style={styles.pokeimgname}>
								<View style={styles.container_pokename}>
									<Text style={styles.pokename}>{pokemon.nome}</Text>
								</View>
								<View style={styles.container_pokeimg}>
									<Image
										source={{ uri: pokemon.img_poke }} // Supondo que a imagem venha de uma URL
										style={styles.pokeimg}
									/>
								</View>
							</View>
							<View style={styles.container_pokeinfo}>
								{[
									{ title: 'Tipo 1', info: pokemon.tipo1 },
									{ title: 'Tipo 2', info: pokemon.tipo2 || 'Nenhum' },
									{ title: 'Habitat', info: pokemon.habitat },
									{ title: 'Cor', info: pokemon.cor },
									{ title: 'Evolução', info: pokemon.numero_evolucao },
								].map((item, idx) => (
									<View key={idx} style={styles.container_cubeinfo}>
										<View style={styles.cubeinfo_title}>
											<Text style={styles.infotitle}>{item.title}</Text>
										</View>
										<View style={styles.pokeinfo}>
											<Text style={styles.infoText}>{item.info}</Text>
										</View>
									</View>
								))}
							</View>
						</View>
					))}
			</ScrollView>
		</View>
	);
};

export default Body;
