<p align="center">
  <img src="./assets/icon.png" alt="PokeGuess logo" width="160" />
</p>

<h1 align="center">PokeGuess — Retro Edition</h1>

<p align="center">
  <em>Adivinhe o Pokémon. Estilo Wordle, 898 criaturas, em pixel art retrô.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react&logoColor=white" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/React-19.1-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/license-MIT-ffd23f" alt="License MIT" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-94a4c4" alt="Platforms" />
</p>

<p align="center">
  <img src="./assets/demo.gif" alt="PokeGuess demo" width="640" />
</p>

<p align="center">
  <a href="./assets/demo.mp4"><em>▶ Versão MP4 (HD)</em></a>
</p>

---

## ✨ Features

- 🎮 **3 modos de jogo**
  - **Normal** — tentativas infinitas até acertar
  - **Difícil** — 15 chutes
  - **Nightmare** — 6 chutes, sem dicas
- 🔢 **Filtro por geração** — escolha 1 a 8 gerações individualmente ou todas as 898 criaturas
- 🧠 **6 colunas de comparação** por chute — Tipo, Geração (ou Evolução), Cor, Habitat, Altura, Peso, com indicadores ↑↓ pras diferenças numéricas
- 💡 **Sistema de dicas** — após 10 chutes (Normal/Difícil), revele atributos do alvo um a um
- 🪄 **Coluna dinâmica GER ↔ EVO** — quando só 1 geração é selecionada, a coluna troca pra Estágio de Evolução automaticamente
- 📳 **Haptics nativos** — vibração diferente para match, partial, miss, win e lose
- 🔊 **Cries oficiais** dos Pokémon na vitória e derrota (via PokeAPI)
- 🎨 **Estética retrô** — Press Start 2P, sprites GB/GBA, paleta GB Color, scanlines
- ⚡ **Prefetch inteligente** — as sugestões são pré-carregadas pra tap-to-submit ser instantâneo
- 📱 **Cross-platform** — iOS (Expo Go), Android (Expo Go) e Web

---

## 🕹️ Como jogar

1. **Tela inicial** — aperte ▶ PRESS START. O botão ⌗ no canto abre o menu de ajustes (modos, gerações, som, desistir).
2. **Digite o nome** da criatura no campo de busca. As sugestões aparecem com o sprite — toque na que quiser chutar.
3. **Cada chute revela 6 células** com cores:
   - 🟩 **Verde** — atributo bate exato
   - 🟨 **Amarelo** — atributo está perto (tipo sobreposto, ±1 geração, ±0.3m altura, ±8kg peso)
   - 🟥 **Vermelho** — errou
   - Setas **↑ / ↓** indicam se o alvo é maior ou menor (altura, peso, geração)
4. **Acerte antes** do limite de tentativas (depende do modo).
5. **No fim**: animação de vitória com cry da criatura + confete, ou tela de derrota com a criatura revelada.

---

## 🚀 Rodar localmente

Precisa de [Node.js 18+](https://nodejs.org/) e o app **[Expo Go](https://expo.dev/go)** no celular (Android ou iOS).

```bash
git clone https://github.com/KauanFortunato/PokeGuess.git
cd PokeGuess
npm install
npm start
```

Quando o terminal mostrar o QR code:

- **iPhone**: abra a câmera, mire no QR → toque no link que aparece → abre no Expo Go
- **Android**: abra o Expo Go → "Scan QR code" → mire no terminal
- **Web**: aperte `w` no terminal

PC e celular devem estar no **mesmo Wi-Fi**. Se a rede bloquear (corporativa, etc.), use `npx expo start --tunnel`.

---

## 🛠️ Stack

| Camada | Tech |
| --- | --- |
| Runtime | [Expo SDK 54](https://expo.dev/) · [React Native 0.81](https://reactnative.dev/) · [React 19.1](https://react.dev/) |
| Plataformas | iOS · Android · Web ([react-native-web](https://necolas.github.io/react-native-web/)) |
| API | [PokeAPI](https://pokeapi.co/) (sprites, dados de espécies, cadeias de evolução, cries) |
| UI/UX | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) · [expo-font](https://docs.expo.dev/versions/latest/sdk/font/) · [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context) |
| Feedback | [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) · [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) |
| Fontes | [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) + [VT323](https://fonts.google.com/specimen/VT323) |

---

## 📂 Estrutura

```
src/
├── api/
│   ├── pokeApiService.js   # cliente PokeAPI: cache, prefetch, fetches paralelos
│   ├── randomPoke.js       # sorteia Pokémon respeitando o filtro de geração
│   ├── filterPoke.js       # filtra sugestões por nome + geração + prefetch
│   └── comparePoke.js      # lógica de comparação dos 6 atributos
├── game/
│   ├── modes.js            # Normal / Difícil / Nightmare
│   ├── gens.js             # ranges de gerações 1-8 e helpers
│   ├── feedback.js         # haptics + mute global
│   └── sound.js            # tocar cries da PokeAPI
├── screens/
│   ├── splash/             # tela inicial: silhuetas + mascote + POKE/GUESS
│   ├── game/               # board 6×6, FlipCell, input com sugestões
│   ├── win/                # orb spin + creature reveal + confete + cry
│   ├── lose/               # shake + revelação da criatura
│   └── settings/           # modal de ajustes (modo, gens, mute, desistir)
├── theme/
│   └── tokens.js           # cores, fontes
└── App.js                  # state machine (splash → game → win/lose)
```

---

## 🤝 Créditos

- **Sprites & dados dos Pokémon** — [PokeAPI](https://pokeapi.co/) (sprites GB/GBA + official artwork + species + cries)
- **Fontes** — [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) por CodeMan38 e [VT323](https://fonts.google.com/specimen/VT323) por Peter Hull

---

## 📝 Licença

[MIT](./LICENSE.txt). Pokémon e seus nomes são marcas registradas da Nintendo / Game Freak — este é um projeto educacional sem fins lucrativos.
