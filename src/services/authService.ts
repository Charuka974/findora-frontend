import api from './api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authService = {
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Matches: POST /api/v1/users/login
    const res = await api.post('/api/v1/users/login', credentials);
    
    // Safely extract token and user (handles if backend isn't returning full AuthResponse yet)
    const token = res.data.token || 'dummy_jwt_token_replace_later';
    const user = res.data.user || res.data;

    localStorage.setItem('findora_token', token);
    localStorage.setItem('findora_user', JSON.stringify(user));
    
    return { token, user };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Matches: POST /api/v1/users (Your Java controller uses this for creation, NOT /register)
    const res = await api.post('/api/v1/users', data);
    
    const token = res.data.token || 'dummy_jwt_token_replace_later';
    const user = res.data.user || res.data;

    localStorage.setItem('findora_token', token);
    localStorage.setItem('findora_user', JSON.stringify(user));
    
    return { token, user };
  },

  async getCurrentUser(): Promise<User> {
    const userJson = localStorage.getItem('findora_user');
    
    if (!userJson) {
      throw new Error('No user authenticated');
    }

    const storedUser = JSON.parse(userJson);

    // Matches: GET /api/v1/users/{id} (Fetches latest data from DB using stored ID)
    const res = await api.get<User>(`/api/v1/users/${storedUser.id}`);
    
    // Update local storage with the freshest user data
    localStorage.setItem('findora_user', JSON.stringify(res.data));
    
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('findora_token');
    localStorage.removeItem('findora_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('findora_token');
  },
};