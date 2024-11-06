import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '99%',
		borderRadius: 8,
		padding: 5,
		alignItems: 'center',
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 10,
	},
	container_list: {
		width: '100%',
	},
	container_entreview: {
		width: '100%',
		height: 110,
		flexDirection: 'row',
		padding: 4,
		backgroundColor: 'white',
		borderRadius: 8,
		marginVertical: 5,
	},
	textAttempt: {
		color: '#C1C1C1',
	},
	pokeimgname: {
		width: '30%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	pokename: {
		textAlign: 'center',
		fontSize: 12,
		color: '#1b1c34',
		fontWeight: 'bold',
	},
	container_pokeimg: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	pokeimg: {
		width: '100%',
		height: '85%',
		resizeMode: 'contain',
	},
	container_pokeinfo: {
		width: '38%',
		flexWrap: 'wrap',
		margin: 2,
		alignItems: 'center',
	},
	container_cubeinfo: {
		width: '55%',
		marginBottom: 3,
		margin: 2,
	},
	cubeinfo_title: {
		marginBottom: 3,
	},
	pokeinfo: {
		width: '100%',
		padding: 5,
		borderRadius: 8,
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

	greenBackground: {
		backgroundColor: '#01d0c3',
	},
	redBackground: {
		backgroundColor: '#F40B5A',
	},
	yellowBackground: {
		backgroundColor: '#DEB307',
	},
});

export default styles;
