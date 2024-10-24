import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '99%',
		height: 100,
		borderRadius: 8,
		padding: 5,
		marginTop: 0,
		alignItems: 'center',
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 10,
	},
	container_entreview: {
		width: '100%',
		height: 150,
		flexDirection: 'row',
		padding: 5,
		backgroundColor: 'white',
		borderRadius: 8,
		marginVertical: 5,
		justifyContent: 'space-between',
	},
	pokeimgname: {
		width: '30%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container_pokename: {
		paddingVertical: 5,
	},
	pokename: {
		textAlign: 'center',
		fontSize: 12,
		color: '#1b1c34',
		fontWeight: 'bold',
	},
	container_pokeimg: {
		width: '80%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	pokeimg: {
		width: '100%',
		height: 50,
		resizeMode: 'contain',
	},
	container_pokeinfo: {
		width: '65%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	container_cubeinfo: {
		width: '48%',
		marginBottom: 5,
	},
	cubeinfo_title: {
		marginBottom: 3,
	},
	pokeinfo: {
		width: '100%',
		padding: 5,
		borderRadius: 8,
		backgroundColor: '#01d0c3',
	},
	infotitle: {
		textAlign: 'center',
		fontSize: 10,
		color: '#1b1c34',
		fontWeight: 'bold',
	},
	infoText: {
		textAlign: 'center',
		fontSize: 10,
		color: 'white',
		fontWeight: 'bold',
	},
});

export default styles;
