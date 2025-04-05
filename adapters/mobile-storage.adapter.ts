import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Enhanced AsyncStorage wrapper with error handling and type safety
 */
export class MobileStorageAdapter {
  /**
   * Save data to storage with type safety
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Storage error while saving ${key}:`, error);
      throw new Error(`Failed to save data for ${key}`);
    }
  }

  /**
   * Get data from storage with type safety
   */
  static async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      
      // If no value found and default provided, return default
      if (jsonValue === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Storage error while retrieving ${key}:`, error);
      
      // Return default value on error if provided
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      
      throw new Error(`Failed to retrieve data for ${key}`);
    }
  }

  /**
   * Remove item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage error while removing ${key}:`, error);
      throw new Error(`Failed to remove data for ${key}`);
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage error while clearing all data:', error);
      throw new Error('Failed to clear storage');
    }
  }

  /**
   * Get all keys in storage
   */
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Storage error while getting all keys:', error);
      throw new Error('Failed to get storage keys');
    }
  }

  /**
   * Check if key exists in storage
   */
  static async hasItem(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Storage error while checking key ${key}:`, error);
      return false;
    }
  }
} 