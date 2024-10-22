import React, { createContext, useContext, useState } from 'react';

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
	const [randomPokemon, setRandomPokemon] = useState(null);

	const updateRandomPokemon = (newPokemon) => {
		setRandomPokemon(newPokemon);
	};

	return (
		<PokemonContext.Provider value={{ randomPokemon, updateRandomPokemon }}>
			{children}
		</PokemonContext.Provider>
	);
};

export const useRandomPokemon = () => {
	const context = useContext(PokemonContext);
	if (!context) {
		throw new Error('useRandomPokemon deve ser usado dentro de um PokemonProvider');
	}
	return context;
};
