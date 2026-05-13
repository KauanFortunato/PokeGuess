import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	// Base is set to './' so the build works in any subdirectory (GitHub Pages too)
	base: './',
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['icons/*.png', 'audio/*.ogg'],
			manifest: {
				name: 'PokeGuess — Retro Edition',
				short_name: 'PokeGuess',
				description: 'Adivinhe o Pokémon. Estilo Wordle, 898 criaturas, pixel art retrô.',
				theme_color: '#0c0a1a',
				background_color: '#0c0a1a',
				display: 'standalone',
				orientation: 'portrait',
				start_url: './',
				scope: './',
				icons: [
					{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				],
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/pokeapi\.co\/api\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'pokeapi-cache',
							expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 },
						},
					},
					{
						urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'pokeapi-sprites',
							expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 },
						},
					},
				],
			},
		}),
	],
	server: {
		host: true,
		port: 5173,
	},
});
