import apiClient from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface RegisterWithClinicRequest extends RegisterRequest {
  clinicId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  age?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  profilePicture?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Auth services
const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  registerWithClinic: async (data: RegisterWithClinicRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register-with-clinic', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    
    // Store tokens
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  requestOtp: async (data: OtpRequest): Promise<void> => {
    await apiClient.post('/auth/request-otp', data);
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },

  checkOtpStatus: async (email: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/check-otp-status', { email });
    return response.data.hasActiveOtp;
  },

  invalidateOtp: async (email: string): Promise<void> => {
    await apiClient.post('/auth/invalidate-otp', { email });
  },

  requestMagicLink: async (email: string): Promise<void> => {
    await apiClient.post('/auth/magic-link', { email });
  },

  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-magic-link', { token });
    
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },

  loginWithGoogle: async (): Promise<void> => {
    // Implement based on Expo Auth Session or similar library
    throw new Error('Not implemented');
  },

  loginWithFacebook: async (): Promise<void> => {
    // Implement based on Expo Auth Session or similar library
    throw new Error('Not implemented');
  },

  loginWithApple: async (): Promise<void> => {
    // Implement based on Expo Auth Session or similar library
    throw new Error('Not implemented');
  },
};

export default authService; 