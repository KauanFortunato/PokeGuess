import React from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import styles from './styles';

const Body = ({ pokemonGuesses }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.textAttempt}>Tentativas: {pokemonGuesses.length}</Text>
			<ScrollView style={styles.container_list}>
				{pokemonGuesses
					.slice()
					.reverse()
					.map((entry, index) => (
						<View key={index} style={styles.container_entreview}>
							{/* Exibir nome e imagem do Pokémon */}
							<View style={styles.pokeimgname}>
								<View style={styles.container_pokename}>
									<Text style={styles.pokename}>{entry.pokemon.nome}</Text>
								</View>
								<View style={styles.container_pokeimg}>
									<Image
										source={{ uri: entry.pokemon.img_poke }}
										style={styles.pokeimg}
									/>
								</View>
							</View>
							<View style={styles.container_pokeinfo}>
								{[
									{
										title: 'Tipo 1',
										info: entry.pokemon.tipo1,
										comparison: entry.comparision.tipo1,
									},
									{
										title: 'Tipo 2',
										info: entry.pokemon.tipo2 || 'Nenhum',
										comparison: entry.comparision.tipo2,
									},
									{
										title: 'Habitat',
										info: entry.pokemon.habitat,
										comparison: entry.comparision.habitat,
									},
									{
										title: 'Cor',
										info: entry.pokemon.cor,
										comparison: entry.comparision.cor,
									},
									{
										title: 'Evolução',
										info: entry.pokemon.numero_evolucao,
										comparison: entry.comparision.numero_evolucao,
									},
								].map((item, idx) => (
									<View key={idx} style={styles.container_cubeinfo}>
										<View style={styles.cubeinfo_title}>
											<Text style={styles.infotitle}>{item.title}</Text>
										</View>
										<View
											style={[
												styles.pokeinfo,
												item.comparison === 'true'
													? styles.greenBackground
													: item.comparison === 'parcial'
													? styles.yellowBackground
													: styles.redBackground,
											]}
										>
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
