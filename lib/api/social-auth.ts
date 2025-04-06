import apiClient from './config';
import { User } from './authService';

export interface SocialAuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface SocialLoginParams {
  token: string;
}

// Handles social logins (Google, Apple)
const socialAuthService = {
  // Login with Google
  async loginWithGoogle(params: SocialLoginParams): Promise<SocialAuthResponse> {
    try {
      const response = await apiClient.post<SocialAuthResponse>('/auth/social/google', params);
      return response.data;
    } catch (error) {
      // Don't log to console, just throw the error for UI handling
      throw error;
    }
  },
  
  // Login with Apple
  async loginWithApple(params: SocialLoginParams): Promise<SocialAuthResponse> {
    try {
      const response = await apiClient.post<SocialAuthResponse>('/auth/social/apple', params);
      return response.data;
    } catch (error) {
      // Don't log to console, just throw the error for UI handling
      throw error;
    }
  },
  
  // Login with social provider
  async login(provider: 'google' | 'apple', token: string): Promise<SocialAuthResponse> {
    const params = { token };
    
    if (provider === 'google') {
      return this.loginWithGoogle(params);
    } else {
      return this.loginWithApple(params);
    }
  },
  
  // Verify the configuration for social logins
  async checkConfiguration() {
    try {
      // In a real implementation, this might check with the backend about available social providers
      // For now we'll assume both are enabled
      return {
        google: { enabled: true },
        apple: { enabled: true }
      };
    } catch (error) {
      // Only return default value, don't log to console
      return {
        google: { enabled: false },
        apple: { enabled: false }
      };
    }
  }
};

export default socialAuthService; 