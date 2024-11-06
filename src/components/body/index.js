import React, { useEffect, useRef } from 'react';
import { View, Image, Text, ScrollView, Animated } from 'react-native';
import styles from './styles';

const Body = ({ pokemonGuesses }) => {
	// Criar uma referência para a animação
	const scaleAnim = useRef(new Animated.Value(0.8)).current;

	Animated.spring(scaleAnim, {
		toValue: 1,
		friction: 2,
		tension: 100,
		useNativeDriver: true,
	}).start();

	useEffect(() => {
		// Disparar a animação sempre que um novo Pokémon for adicionado
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 1.1, // Aumenta para 1.2
				duration: 300, // Duração da animação para o crescimento
				useNativeDriver: true, // Utilizar o driver nativo para melhor performance
			}),
			Animated.timing(scaleAnim, {
				toValue: 1.0, // Retorna para 1.0
				duration: 300, // Duração da animação para a volta
				useNativeDriver: true,
			}),
		]).start();

		// Resetar a escala para 0.8 quando um novo Pokémon é adicionado
		scaleAnim.setValue(0.8);
	}, [pokemonGuesses]); // Dependência em pokemonGuesses para animar sempre que mudar

	return (
		<View style={styles.container}>
			<Text style={styles.textAttempt}>Tentativas: {pokemonGuesses.length}</Text>
			<ScrollView style={styles.container_list}>
				{pokemonGuesses
					.slice()
					.reverse()
					.map((entry, index) => {
						return (
							<Animated.View
								key={index}
								style={[
									styles.container_entreview,
									// Aplicar animação apenas ao último Pokémon adicionado
									index === 0 ? { transform: [{ scale: scaleAnim }] } : {},
								]}
							>
								{/* Exibir nome e imagem do Pokémon */}
								<View style={styles.pokeimgname}>
									<View style={styles.container_pokename}>
										<Text style={styles.pokename}>{entry.pokemon.nome}</Text>
									</View>
									<View style={styles.container_pokeimg}>
										<Image
											source={{ uri: entry.pokemon.img_poke }}
											style={styles.pokeimg}
											resizeMode="contain"
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
											title: 'Cor',
											info: entry.pokemon.cor,
											comparison: entry.comparision.cor,
										},
										{
											title: 'Altura',
											info: entry.pokemon.altura,
											comparison: entry.comparision.altura,
										},
										{
											title: 'Habitat',
											info: entry.pokemon.habitat,
											comparison: entry.comparision.habitat,
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
							</Animated.View>
						);
					})}
			</ScrollView>
		</View>
	);
};

export default Body;
