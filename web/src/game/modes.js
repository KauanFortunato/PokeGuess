export const MODES = {
	normal: {
		key: 'normal',
		label: 'NORMAL',
		sub: '∞',
		description: 'Infinitas tentativas',
		maxGuesses: Infinity,
	},
	hard: {
		key: 'hard',
		label: 'DIFÍCIL',
		sub: '15',
		description: '15 tentativas',
		maxGuesses: 15,
	},
	nightmare: {
		key: 'nightmare',
		label: 'NIGHTMARE',
		sub: '6',
		description: '6 tentativas',
		maxGuesses: 6,
	},
};

export const MODE_ORDER = ['normal', 'hard', 'nightmare'];
export const DEFAULT_MODE = 'nightmare';
