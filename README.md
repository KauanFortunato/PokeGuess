<p align="center">
  <img src="./assets/icon.png" alt="PokeGuess logo" width="160" />
</p>

<h1 align="center">PokeGuess — Retro Edition</h1>

<p align="center">
  <em>Guess the Pokémon. Wordle-style, 898 creatures, retro pixel art. Installable as a PWA.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/React-19.1-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind 3.4" />
  <img src="https://img.shields.io/badge/PWA-installable-5a0fc8?logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/license-MIT-ffd23f" alt="License MIT" />
</p>

<p align="center">
  <img src="./assets/demo.gif" alt="PokeGuess demo" width="640" />
</p>

<p align="center">
  <a href="./assets/demo.mp4"><em>▶ MP4 version (HD)</em></a>
</p>

---

## ✨ Features

- 🎮 **3 game modes**
  - **Normal** — unlimited guesses until you nail it
  - **Hard** — 15 guesses
  - **Nightmare** — 6 guesses, no hints
- 🔢 **Generation filter** — pick any of the 8 generations individually, or play across all 898 creatures
- 🧠 **6 comparison columns** per guess — Type, Generation (or Evolution), Color, Habitat, Height, Weight, with ↑↓ indicators for numeric differences
- 💡 **Hint system** — after 10 guesses (Normal/Hard), reveal target attributes one by one
- 🪄 **Dynamic GEN ↔ EVO column** — when only 1 generation is selected, the column switches automatically to Evolution Stage
- 📳 **Haptics** via `navigator.vibrate` (Android Chrome)
- 🔊 **Official Pokémon cries** on win and loss (via PokeAPI)
- 🎨 **Retro aesthetic** — Press Start 2P, GB/GBA sprites, GB Color palette
- ⚡ **Smart prefetch** — suggestions are pre-loaded so tap-to-submit feels instant
- 📱 **Installable PWA** — offline service worker + manifest, works like a native app
- 🌐 **108 KB gzipped** — lean bundle, loads instantly

---

## 🕹️ How to play

1. **Splash screen** — hit ▶ PRESS START. The ⌗ button in the corner opens the settings menu (modes, generations, sound, give up).
2. **Type the creature's name** into the search box. Suggestions appear with sprites — tap one to submit it as your guess.
3. **Each guess reveals 6 cells** with colors:
   - 🟩 **Green** — exact match
   - 🟨 **Yellow** — close (overlapping type, ±1 generation, ±0.3m height, ±8kg weight)
   - 🟥 **Red** — miss
   - **↑ / ↓** arrows indicate whether the target is larger or smaller (height, weight, generation)
4. **Get it right** before you run out of attempts (depends on the mode).
5. **At the end**: a win animation with the creature's cry + confetti, or a loss screen revealing the target.

---

## 🚀 Run locally

Requires [Node.js 18+](https://nodejs.org/).

```bash
git clone https://github.com/KauanFortunato/PokeGuess.git
cd PokeGuess
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite also prints the network IP so you can test on your phone (same Wi-Fi).

### Production build

```bash
npm run build      # outputs dist/
npm run preview    # serves dist/ locally to test
```

### Install as a PWA

On Chrome (desktop or Android): address bar → "install" icon.
On iPhone Safari: Share → "Add to Home Screen".

---

## 🛠️ Stack

| Layer | Tech |
| --- | --- |
| Build | [Vite 6](https://vitejs.dev/) |
| UI | [React 19.1](https://react.dev/) + [Tailwind CSS 3.4](https://tailwindcss.com/) |
| Animations | [framer-motion](https://www.framer.com/motion/) + CSS keyframes |
| PWA | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) |
| API | [PokeAPI](https://pokeapi.co/) (sprites, species data, evolution chains, cries) |
| Audio | HTML5 `Audio` API |
| Haptics | Web `navigator.vibrate` |
| Fonts | [@fontsource/press-start-2p](https://fontsource.org/) + [VT323](https://fontsource.org/) (self-hosted, no CDN) |
| Helpers | [clsx](https://github.com/lukeed/clsx) |

---

## 📂 Structure

```
.
├── index.html
├── package.json
├── vite.config.js          # vite + plugin-pwa + plugin-react
├── tailwind.config.js      # theme tokens (colors, fonts, keyframes)
├── postcss.config.js
├── public/
│   ├── icons/              # PWA icons (192, 512, 512-maskable)
│   └── img/                # creature.png (splash mascot)
├── src/
│   ├── api/
│   │   ├── pokeApiService.js   # PokeAPI client: cache, prefetch, parallel fetches
│   │   ├── randomPoke.js       # picks a Pokémon honoring the generation filter
│   │   ├── filterPoke.js       # filters suggestions by name + generation + prefetch
│   │   └── comparePoke.js      # comparison logic for the 6 attributes
│   ├── game/
│   │   ├── modes.js            # Normal / Hard / Nightmare
│   │   ├── gens.js             # ranges for generations 1-8 and helpers
│   │   ├── feedback.js         # navigator.vibrate + global mute
│   │   └── sound.js            # cries via HTML5 Audio
│   ├── screens/
│   │   ├── Splash.jsx          # splash screen: silhouettes + mascot + POKE/GUESS
│   │   ├── Game.jsx            # 6×6 board, FlipCell, input with suggestions
│   │   ├── Win.jsx             # orb spin + creature reveal + confetti + cry
│   │   ├── Lose.jsx            # shake + creature reveal
│   │   └── Settings.jsx        # settings modal
│   ├── components/
│   │   ├── Board.jsx
│   │   ├── FlipCell.jsx        # 3D rotateX flip via CSS
│   │   ├── GuessRow.jsx
│   │   └── InputRow.jsx
│   ├── App.jsx                 # state machine (splash → game → win/lose)
│   ├── main.jsx                # entry point
│   └── index.css               # Tailwind base + reset
└── assets/                     # README assets (logo, demo.gif, demo.mp4)
```

---

## 🤝 Credits

- **Pokémon sprites & data** — [PokeAPI](https://pokeapi.co/) (GB/GBA sprites + official artwork + species + cries)
- **Fonts** — [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38 and [VT323](https://fonts.google.com/specimen/VT323) by Peter Hull

---

## 📝 License

[MIT](./LICENSE.txt). Pokémon and its names are registered trademarks of Nintendo / Game Freak — this is a non-profit educational project.
