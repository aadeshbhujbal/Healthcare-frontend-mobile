import apiClient from './config';

export interface HealthStatus {
  status: string;
  uptime: number;
  message: string;
}

export interface RedisHealthStatus {
  status: string;
  message: string;
}

const healthService = {
  getSystemHealth: async (): Promise<HealthStatus> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getRedisHealth: async (): Promise<RedisHealthStatus> => {
    const response = await apiClient.get('/health/redis');
    return response.data;
  },
  
  checkApiStatus: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200 && response.data.status === 'ok';
    } catch (error) {
      console.error('API status check error:', error);
      return false;
    }
  }
};

export default healthService; 