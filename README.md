# Healthcare Frontend Mobile App

A mobile application for healthcare management built with React Native and Expo.

## API Integration

This app is configured to connect to a backend API running on `http://localhost:8088`. The API endpoints implemented in this application include:

- Authentication (login, register, OTP, etc.)
- User management
- Clinic management
- Health status checks
- Cache management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or NPM
- Expo CLI
- Backend API running on port 8088

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Make sure you have a `.env` file with the following content:

```
API_URL=http://localhost:8088
```

Adjust the API URL if your backend is running on a different host or port.

### Running the Application

```bash
# Start the development server
yarn dev
# or
npm run dev

# Start on Android
yarn android
# or
npm run android

# Start on iOS
yarn ios
# or
npm run ios

# Start on Web
yarn web
# or
npm run web
```

## Project Structure

- `/lib/api` - API service functions for connecting to the backend
- `/providers` - React context providers for authentication and data fetching
- `/app` - Main application screens and layouts
- `/components` - Reusable UI components

## Dependencies

This project uses the following key dependencies:

- React Native / Expo
- Axios for API requests
- React Query for data fetching and caching
- AsyncStorage for local storage
- React Navigation for routing

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the API:

1. Verify the backend server is running on port 8088
2. Check that your `.env` file has the correct API URL
3. For Android emulators, you might need to use `10.0.2.2:8088` instead of `localhost`
4. For iOS simulators, you might need to use `127.0.0.1:8088` instead of `localhost`
