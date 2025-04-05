import apiClient from './config';

export interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
}

export interface CacheDebugInfo {
  entries: Record<string, any>;
  ttls: Record<string, number>;
}

const cacheService = {
  getCacheStats: async (): Promise<CacheStats> => {
    const response = await apiClient.get('/cache/stats');
    return response.data;
  },

  getCacheDebugInfo: async (): Promise<CacheDebugInfo> => {
    const response = await apiClient.get('/cache/debug');
    return response.data;
  },

  clearCache: async (): Promise<void> => {
    await apiClient.delete('/cache/clear');
  }
};

export default cacheService; 