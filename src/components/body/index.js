import React from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import styles from './styles';

const Body = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container_list}>
				{Array(10)
					.fill(null)
					.map((_, index) => (
						<View key={index} style={styles.container_entreview}>
							<View style={styles.pokeimgname}>
								<View style={styles.container_pokename}>
									<Text style={styles.pokename}>Kangaskhan</Text>
								</View>
								<View style={styles.container_pokeimg}>
									<Image
										source={require('./115Kangaskhan.webp')}
										style={styles.pokeimg}
									/>
								</View>
							</View>
							<View style={styles.container_pokeinfo}>
								{[
									{ title: 'Tipo 1', info: 'Normal' },
									{ title: 'Tipo 2', info: 'Nenhum' },
									{ title: 'Habitat', info: 'Savana' },
									{ title: 'Cor', info: 'Marrom' },
									{ title: 'Evolução', info: '2ª' },
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
