import apiClient from './config';
import { User } from './authService';

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface UpdateRoleRequest {
  role: string;
}

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/user/all');
    return response.data;
  },

  getUserProfile: async (): Promise<User> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/user/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch(`/user/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
  },

  getAllPatients: async (): Promise<User[]> => {
    const response = await apiClient.get('/user/role/patient');
    return response.data;
  },

  getAllDoctors: async (): Promise<User[]> => {
    const response = await apiClient.get('/user/role/doctors');
    return response.data;
  },

  getAllReceptionists: async (): Promise<User[]> => {
    const response = await apiClient.get('/user/role/receptionists');
    return response.data;
  },

  getAllClinicAdmins: async (): Promise<User[]> => {
    const response = await apiClient.get('/user/role/clinic-admins');
    return response.data;
  },

  updateUserRole: async (id: string, data: UpdateRoleRequest): Promise<User> => {
    const response = await apiClient.put(`/user/${id}/role`, data);
    return response.data;
  }
};

export default userService; 