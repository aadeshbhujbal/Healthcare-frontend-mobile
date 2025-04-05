import apiClient from './config';
import { User } from './authService';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  appName?: string;
  logo?: string;
  phoneNumber?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClinicRequest {
  name: string;
  address: string;
  appName?: string;
  logo?: string;
  phoneNumber?: string;
  email?: string;
}

export interface AssignClinicAdminRequest {
  userId: string;
}

export interface RegisterPatientRequest {
  clinicId: string;
  patientId: string;
}

const clinicService = {
  createClinic: async (data: CreateClinicRequest): Promise<Clinic> => {
    const response = await apiClient.post('/clinics', data);
    return response.data;
  },

  getAllClinics: async (): Promise<Clinic[]> => {
    const response = await apiClient.get('/clinics');
    return response.data;
  },

  getClinicById: async (id: string): Promise<Clinic> => {
    const response = await apiClient.get(`/clinics/${id}`);
    return response.data;
  },

  getClinicByAppName: async (appName: string): Promise<Clinic> => {
    const response = await apiClient.get(`/clinics/app/${appName}`);
    return response.data;
  },

  assignClinicAdmin: async (clinicId: string, data: AssignClinicAdminRequest): Promise<void> => {
    await apiClient.post(`/clinics/${clinicId}/admins`, data);
  },

  removeClinicAdmin: async (adminId: string): Promise<void> => {
    await apiClient.delete(`/clinics/admins/${adminId}`);
  },

  getClinicDoctors: async (clinicId: string): Promise<User[]> => {
    const response = await apiClient.get(`/clinics/${clinicId}/doctors`);
    return response.data;
  },

  getClinicPatients: async (clinicId: string): Promise<User[]> => {
    const response = await apiClient.get(`/clinics/${clinicId}/patients`);
    return response.data;
  },

  registerPatientToClinic: async (data: RegisterPatientRequest): Promise<void> => {
    await apiClient.post('/clinics/register-patient', data);
  }
};

export default clinicService; 