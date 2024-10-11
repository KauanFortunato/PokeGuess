import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
	{ files: ['**/*.{js,mjs,cjs,jsx}'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	pluginReact.configs.flat.recommended,

	{
		plugins: {
			'react-native': pluginReactNative,
			prettier,
		},
		rules: {
			...pluginReactNative.configs.recommended.rules,
			'prettier/prettier': 'error',
		},
	},
];
