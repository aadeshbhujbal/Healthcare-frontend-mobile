import apiClient from './config';
import authService from './authService';
import userService from './userService';
import clinicService from './clinicService';
import healthService from './healthService';
import cacheService from './cacheService';
import socialAuthService from './social-auth';

export {
  apiClient,
  authService,
  userService,
  clinicService,
  healthService,
  cacheService,
  socialAuthService
};

// Re-export types
export * from './authService';
export * from './userService';
export * from './clinicService';
export * from './healthService';
export * from './cacheService';
export * from './social-auth'; 