import React, { useState } from 'react';
import { SafeAreaView, View, Image, TouchableOpacity, Keyboard, Modal, Text } from 'react-native';
import styles from './styles';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

const Header = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState('');

	const handleButtonPress = (text) => {
		Keyboard.dismiss();
		setModalText(text);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container_utility}>
				<TouchableOpacity
					style={styles.button_help}
					onPress={() =>
						handleButtonPress(
							'Escreva o nome de um Pokémon e verifique suas características e o quão próximo ele está do Pokémon escondido.'
						)
					}
				>
					<Feather name="help-circle" size={24} color="white" />
				</TouchableOpacity>

				<View style={styles.container_logo}>
					<Image
						source={require('../../../assets/img/logo.png')}
						style={styles.logo}
						resizeMode="contain"
					/>
				</View>
			</View>

			{/* Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={closeModal}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<TouchableOpacity style={styles.closeButton} onPress={closeModal}>
							<AntDesign name="closecircleo" size={24} color="black" />
						</TouchableOpacity>

						<Text style={styles.titleHelp}>Como Jogar</Text>
						<Text style={styles.modalText}>{modalText}</Text>
						<Image
							source={require('../../../assets/img/ajuda-img.png')}
							style={styles.helpImage}
							resizeMode="contain"
						/>

						<Text style={styles.subTitleHelp}>Cores</Text>
						<View style={styles.colorLegendContainer}>
							<View style={styles.colorBoxContainer}>
								<View style={[styles.colorBox, { backgroundColor: '#01D0C3' }]} />
								<Text style={styles.colorLabel}>Correto</Text>
							</View>
							<View style={styles.colorBoxContainer}>
								<View style={[styles.colorBox, { backgroundColor: '#DEB307' }]} />
								<Text style={styles.colorLabel}>Parcial</Text>
							</View>
							<View style={styles.colorBoxContainer}>
								<View style={[styles.colorBox, { backgroundColor: '#F40B5A' }]} />
								<Text style={styles.colorLabel}>Incorreto</Text>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default Header;
