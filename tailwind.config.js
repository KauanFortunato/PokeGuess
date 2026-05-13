/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				bg: {
					deep: '#0c0a1a',
					mid: '#1a1730',
					card: '#2a2550',
					cell: '#3d3870',
					input: '#1f1c3a',
					root: '#050410',
					gradientCenter: '#1a1535',
				},
				line: {
					DEFAULT: '#5d4f9c',
					soft: '#3d3870',
				},
				txt: {
					DEFAULT: '#f4f0e8',
					dim: '#94a4c4',
					faint: '#5d4f9c',
				},
				accent: {
					DEFAULT: '#ffd23f',
					pink: '#ff6b9d',
					mint: '#7fffd4',
					blue: '#41a6f6',
				},
				match: {
					DEFAULT: '#88e060',
					deep: '#3b8b3b',
				},
				partial: {
					DEFAULT: '#ffcc4e',
					deep: '#a87410',
				},
				miss: {
					DEFAULT: '#ef5050',
					deep: '#8a2a2a',
				},
			},
			fontFamily: {
				pixel: ['"Press Start 2P"', 'monospace'],
				mono: ['VT323', 'monospace'],
			},
			animation: {
				bob: 'bob 1.4s ease-in-out infinite',
				twinkle: 'twinkle 1.6s ease-in-out infinite',
				blink: 'blink 1s steps(2) infinite',
				shake: 'shake 0.4s steps(3)',
				orb: 'orb 0.8s linear',
				flash: 'flash 0.6s ease-out',
				'flip-back': 'flip-back 0.5s cubic-bezier(0.5,0,0.5,1) forwards',
				'creature-in': 'creature-in 0.6s cubic-bezier(0.3,1.5,0.4,1) forwards',
				confetti: 'confetti-fall linear forwards',
			},
			keyframes: {
				bob: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' },
				},
				twinkle: {
					'0%, 100%': { opacity: '0.1', transform: 'scale(0.6)' },
					'50%': { opacity: '1', transform: 'scale(1)' },
				},
				blink: {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0.3' },
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-4px)' },
					'75%': { transform: 'translateX(4px)' },
				},
				orb: {
					'0%': { transform: 'rotate(0deg) scale(0.6)', opacity: '0' },
					'20%': { opacity: '1' },
					'100%': { transform: 'rotate(540deg) scale(1)' },
				},
				flash: {
					'0%': { opacity: '0', transform: 'scale(0.4)' },
					'30%': { opacity: '1' },
					'100%': { opacity: '0', transform: 'scale(1.4)' },
				},
				'flip-back': {
					'0%': { transform: 'rotateX(0deg)' },
					'100%': { transform: 'rotateX(180deg)' },
				},
				'creature-in': {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'confetti-fall': {
					'0%': { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translate(var(--drift,0),700px) rotate(360deg)', opacity: '0' },
				},
			},
		},
	},
	plugins: [],
};
