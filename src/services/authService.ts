import api from './api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper to delay mock responses for realistic UX
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay();
      const users: User[] = JSON.parse(localStorage.getItem('findora_mock_users') || '[]');
      let user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (!user) {
        // Create a default mock user if they don't exist yet
        user = {
          id: 'user_mock_' + (users.length + 1),
          name: credentials.email.split('@')[0].toUpperCase(),
          email: credentials.email,
          phone: '+1 (555) 019-2834',
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem('findora_mock_users', JSON.stringify(users));
      }

      const response: AuthResponse = {
        token: 'mock_jwt_token_for_' + user.id,
        user,
      };

      localStorage.setItem('findora_token', response.token);
      localStorage.setItem('findora_user', JSON.stringify(response.user));
      return response;
    }

    const res = await api.post<AuthResponse>('/api/v1/users/login', credentials);
    localStorage.setItem('findora_token', res.data.token);
    localStorage.setItem('findora_user', JSON.stringify(res.data.user));
    return res.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay();
      const users: User[] = JSON.parse(localStorage.getItem('findora_mock_users') || '[]');
      
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('Email already registered');
      }

      const newUser: User = {
        id: 'user_mock_' + (users.length + 1),
        name: data.name,
        email: data.email,
        phone: data.phone || '+1 (555) 000-0000',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('findora_mock_users', JSON.stringify(users));

      const response: AuthResponse = {
        token: 'mock_jwt_token_for_' + newUser.id,
        user: newUser,
      };

      localStorage.setItem('findora_token', response.token);
      localStorage.setItem('findora_user', JSON.stringify(response.user));
      return response;
    }

    const res = await api.post<AuthResponse>('/api/v1/users/register', data);
    localStorage.setItem('findora_token', res.data.token);
    localStorage.setItem('findora_user', JSON.stringify(res.data.user));
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      const userJson = localStorage.getItem('findora_user');
      if (!userJson) {
        throw new Error('No user authenticated');
      }
      return JSON.parse(userJson);
    }

    const res = await api.get<User>('/api/v1/users/me');
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
