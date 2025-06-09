# bussd - London Bus Journey Tracker

A cross-platform mobile application built with Expo that helps users track their London bus journeys, stops visited, and routes taken.

## Features

- Track visited bus stops across London
- Record bus routes taken
- View journey history
- Cross-platform support (iOS and Android)
- Interactive map interface
- Real-time bus information

## Tech Stack

- **Framework:** [Expo](https://expo.dev/)
- **Language:** TypeScript
- **UI Components:** React Native
- **Navigation:** React Navigation
- **State Management:** React Context/Redux (TBD)
- **Maps:** React Native Maps
- **API Integration:** Transport for London (TfL) API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bussd.git
cd bussd
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

## Development

- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app to open on your device

## Environment Setup

Create a `.env` file in the root directory with the following variables:
```
EXPO_PUBLIC_URL=your_api_url
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/      # API and other services
├── hooks/         # Custom React hooks
├── context/       # React Context files
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Transport for London (TfL) for providing the API
- Expo team for the amazing development framework
- All contributors who help improve this project
