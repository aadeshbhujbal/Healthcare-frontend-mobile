import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL as ENV_API_URL } from '@env';
import { Platform } from 'react-native';

// ======== FIXED URL CONFIGURATION ========
// For Android emulators, always use 10.0.2.2 instead of localhost (10.0.2.2 points to host machine)
// For real Android devices, use the actual IP address of your development machine
// For iOS simulators, localhost works fine

// Define the URL options
const LOCAL_IP = '192.168.1.35'; // Your computer's actual IP address - CHANGE THIS!
const PORT = '8088';

// Try to get the computer's local IP from environment variables if available
let COMPUTER_IP = LOCAL_IP;
if (typeof process !== 'undefined' && process.env && process.env.COMPUTER_IP) {
  COMPUTER_IP = process.env.COMPUTER_IP;
  console.log(`Using environment variable for COMPUTER_IP: ${COMPUTER_IP}`);
}

// Select the appropriate base URL based on platform and environment
const getBaseUrl = () => {
  // If environment variable is set, use it (highest priority)
  if (ENV_API_URL) return ENV_API_URL;
  
  if (Platform.OS === 'android') {
    // For Android, we need to determine if it's an emulator or real device
    const isEmulator = false; // Default to physical device to be safe
    
    try {
      // This is a more reliable way to check for emulator
      // A better check would involve native code, but this is a reasonable guess
      if (Platform.constants.Brand === 'google' || 
          Platform.constants.Model?.includes('sdk') ||
          Platform.constants.Model?.includes('emulator')) {
        return `http://10.0.2.2:${PORT}`;
      }
    } catch (e) {
      console.log('Error detecting emulator, defaulting to physical device:', e);
    }
    
    // If not emulator or detection failed, use the actual IP
    return `http://${COMPUTER_IP}:${PORT}`;
  } 
  
  // For iOS, localhost works in simulator
  return `http://localhost:${PORT}`;
};

// Get the base URL
const BASE_URL = getBaseUrl();
console.log(`Selected API URL: ${BASE_URL}`);

// Define fallback URLs in order of preference
const FALLBACK_URLS = [
  BASE_URL,
  `http://10.0.2.2:${PORT}`,
  `http://${COMPUTER_IP}:${PORT}`,
  `http://localhost:${PORT}`,
  'https://api.yourhealthcareapp.com', // Add your production URL here
];

// Create the API client with the determined URL
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 15000, // Increased timeout for slower connections
});

// Log what URL we're using
console.log(`API client using baseURL: ${apiClient.defaults.baseURL}`);

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`Full request URL: ${config.baseURL}${config.url}`);
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response Error:', error.message);
      
      // Try the next URL in our fallback list
      const currentUrl = apiClient.defaults.baseURL || '';
      const currentIndex = FALLBACK_URLS.indexOf(currentUrl);
      if (currentIndex >= 0 && currentIndex < FALLBACK_URLS.length - 1) {
        const nextUrl = FALLBACK_URLS[currentIndex + 1];
        console.log(`Network error with ${currentUrl}. Trying next API URL: ${nextUrl}`);
        apiClient.defaults.baseURL = nextUrl;
        
        // For educational purposes only
        console.log("Switched to backup URL. Actual retry requires additional implementation.");
      } else {
        console.error("Exhausted all fallback URLs or current URL not in fallback list.");
      }
      
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 