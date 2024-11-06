import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	Image,
	TouchableOpacity,
	Keyboard,
	Modal,
	Text,
	Switch,
} from 'react-native';
import styles from './styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

const Header = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState('');
	const [isDarkMode, setIsDarkMode] = useState(false);

	const handleButtonPress = (text) => {
		Keyboard.dismiss();
		setModalText(text);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container_utility}>
				<TouchableOpacity
					style={styles.button_help}
					onPress={() =>
						handleButtonPress(
							'Ao entrar no app, um Pokémon é sorteado. Você tem várias tentativas para adivinhar o Pokémon. À medida que adiciona palpites, descobrirá algumas características dos Pokémon tendo tambem ajuda da barra de pesquisa. Use essas pistas para tentar acertar o Pokémon o mais rápido possível!'
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
							<AntDesign name="closecircle" size={24} color="#7971A0" />
						</TouchableOpacity>
						<Text style={styles.modalText}>{modalText}</Text>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default Header;
