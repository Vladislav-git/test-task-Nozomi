import axios from 'axios';

const API_URL = 'http://10.0.2.2:8090';

const api = {
  signIn: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/signIn`, {email, password});
    return response.data;
  },
  signUp: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/signUp`, {email, password});
    return response.data;
  },
  getMedications: async (token: string | null) => {
    const response = await axios.get(`${API_URL}/medications`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  },
  getMedicationById: async (medicationId: number, token: string) => {
    const response = await axios.get(`${API_URL}/medications/${medicationId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  },
  addMedication: async (
    medication: {
      name: string;
      description: string;
      count: number;
      destination_count: number;
    },
    token: string | null,
  ) => {
    const response = await axios.post(
      `${API_URL}/medications/add`,
      {medication, token},
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data;
  },
  updateMedication: async (
    medicationId: number,
    medication: {
      name: string;
      description: string;
      count: number;
      destination_count: number;
    },
    token: string,
  ) => {
    const response = await axios.put(
      `${API_URL}/medications/${medicationId}`,
      medication,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data;
  },
  deleteMedication: async (medicationId: number, token: string) => {
    const response = await axios.delete(
      `${API_URL}/medications/${medicationId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data;
  },
  validateToken: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/validateToken`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export default api;
