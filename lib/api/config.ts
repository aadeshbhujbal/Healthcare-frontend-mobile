import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL as ENV_API_URL } from '@env';
import { Platform } from 'react-native';

// Using the environment variable or fallback to localhost with correct format for Android emulators
// Android emulator needs 10.0.2.2 instead of localhost
const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8088' : 'http://localhost:8088';
const API_URL = ENV_API_URL || DEFAULT_URL;

console.log(`Using API URL: ${API_URL}`); // Helpful for debugging

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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

// Add a response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error or timeout:', error.message);
      // Consider returning a custom error object here if needed
    }
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Handle token refresh or redirect to login
      try {
        await AsyncStorage.removeItem('token');
        // Add your navigation logic here if needed
      } catch (storageError) {
        console.error('Error removing token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 