# LeafLog

**LeafLog** is a cross-platform mobile app for iOS and Android that helps you keep a diary of your houseplants. Take a photo of your plant — and Gemini AI will identify the species, assess its health, and provide personalized care recommendations.

![LeafLog](https://img.shields.io/badge/LeafLog-🌿-green)

---

## ✨ Features

- 📸 **Photo analysis** — snap a photo with your camera or pick one from your gallery
- 🤖 **AI diagnostics** — Gemini identifies the species, evaluates health, and detects issues (yellowing, spots, pests, wilting)
- 💧 **Care recommendations** — personalized advice on watering, lighting, and humidity
- 📋 **Check history** — track your plant's condition over time
- 🌍 **Multi-language** — English and Russian interface
- 💾 **Local storage** — all data stays on your device (SQLite + MMKV)
- 📱 **Cross-platform** — single codebase for iOS and Android

---

## 🛠 Tech Stack

| Category        | Technologies                                                              |
| --------------- | ------------------------------------------------------------------------- |
| **Platform**    | [React Native](https://reactnative.dev) 0.87 + TypeScript                 |
| **AI**          | [Google Gemini API](https://ai.google.dev) (`gemini-3.5-flash-lite`)      |
| **Navigation**  | [React Navigation](https://reactnavigation.org) v7 (Stack + Bottom Tabs)  |
| **State**       | [TanStack Query](https://tanstack.com/query) v5                          |
| **Database**    | [OP-SQLite](https://op-engineering.github.io/op-sqlite/) (SQLite)         |
| **Storage**     | [MMKV](https://github.com/mrousavy/react-native-mmkv)                     |
| **i18n**        | [i18next](https://www.i18next.com) + react-i18next                        |
| **UI**          | Reanimated 4, Gesture Handler, FlashList                                  |

---

## 📋 Requirements

- **Node.js** ≥ 22.11
- **React Native CLI** — [setup guide](https://reactnative.dev/docs/set-up-your-environment)
- **Xcode** ≥ 15 (for iOS)
- **Android Studio** + SDK 34 (for Android)
- **Gemini API Key** — get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/your-org/LeafLog.git
cd LeafLog
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

> ⚠️ **Important:** Never commit the `.env` file to the repository. It is already listed in `.gitignore`.

### 4. Install native dependencies (iOS)

```sh
cd ios && bundle install && bundle exec pod install && cd ..
```

---

## ▶️ Running the App

### Metro bundler

```sh
npm start
```

### Android

```sh
npm run android
```

### iOS

```sh
npm run ios
```

---

## 🧪 Testing

```sh
npm test
```

---

## 📁 Project Structure

```
LeafLog/
├── src/
│   ├── ai/              # Gemini AI integration (analysis, types, errors)
│   ├── api/             # API layer for data operations
│   ├── components/      # Reusable components
│   ├── db/              # SQLite client and data types
│   ├── hooks/           # React Query hooks (CRUD for plants and checks)
│   ├── i18n/            # Localization (EN, RU)
│   ├── navigation/      # Navigation (Stack, Tabs)
│   ├── screens/         # App screens
│   │   ├── AddPlant/        # Add plant with AI analysis
│   │   ├── PlantDetail/     # Plant details + re-analysis
│   │   ├── PlantsList/      # Plant list (grid)
│   │   ├── Settings/        # Settings
│   │   └── LanguagePicker/  # Language selection
│   ├── storage/         # MMKV storage
│   ├── stores/          # Global state
│   ├── theme/           # Colors, spacing, radii
│   ├── types/           # Shared types
│   ├── ui/              # Base UI components
│   └── utils/           # Utilities (photo storage, etc.)
├── android/             # Android native code
├── ios/                 # iOS native code
├── App.tsx              # Entry point
└── package.json
```

---

## 📱 Screenshots

<!-- Add app screenshots here -->

| Plant List | Add Plant | Plant Details |
| ---------- | --------- | ------------- |
| _coming soon_ | _coming soon_ | _coming soon_ |

---

## 🔒 Privacy

All data is stored locally on the user's device. Photos are sent to the Gemini API only for analysis and are not retained on Google's servers after the request is processed.

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please open issues and pull requests.

---

<div align="center">

🌿 **LeafLog** — your personal AI-powered gardening assistant

</div>
