import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from './styles'; // Importa o estilo

const Body = () => {
	return (
		<View style={styles.container}>
			<View style={styles.container_entreview}>
				<View style={styles.pokeimgname}>
					<View style={styles.container_pokename}>
						<Text style={styles.pokename}>Kangaskhan</Text>
					</View>
					<View style={styles.container_pokeimg}>
						<Image source={require('./115Kangaskhan.webp')} style={styles.pokeimg} />
					</View>
				</View>

				<View style={styles.container_pokeinfo}>
					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Tipo 1</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Normal</Text>
						</View>
					</View>

					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Tipo 2</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Nenhum</Text>
						</View>
					</View>

					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Habitat</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Savana</Text>
						</View>
					</View>

					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Cor</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Marrom</Text>
						</View>
					</View>

					{/* Campo de Evolução */}
					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Evolução</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Sim, 2ª Evolução</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.container_entreview}>
				<View style={styles.pokeimgname}>
					<View style={styles.container_pokename}>
						<Text style={styles.pokename}>Kangaskhan</Text>
					</View>
					<View style={styles.container_pokeimg}>
						<Image source={require('./115Kangaskhan.webp')} style={styles.pokeimg} />
					</View>
				</View>

				<View style={styles.container_pokeinfo}>
					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Tipo 1</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Normal</Text>
						</View>
					</View>

					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Tipo 2</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Nenhum</Text>
						</View>
					</View>

					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Habitat</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Savana</Text>
						</View>
					</View>

					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Cor</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Marrom</Text>
						</View>
					</View>

					{/* Campo de Evolução */}
					<View style={styles.container_cubeinfo}>
						<View style={styles.cubeinfo_title}>
							<Text style={styles.infotitle}>Evolução</Text>
						</View>
						<View style={styles.pokeinfo}>
							<Text style={styles.infoText}>Sim, 2ª Evolução</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default Body;
