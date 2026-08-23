import api from './api';
import type { Item, CreateItemRequest, UpdateItemRequest, ItemType, ItemStatus } from '../types/item';

export const itemService = {
  
  async getItems(filters: {
    type?: ItemType | '';
    category?: string | '';
    status?: ItemStatus | '';
    location?: string;
    userId?: string;
  } = {}): Promise<Item[]> {
    
    // If filtering by user, use the specific user endpoint
    if (filters.userId) {
      const res = await api.get<Item[]>(`/api/v1/items/user/${filters.userId}`);
      return res.data;
    }

    // Otherwise, build standard query parameters
    const params: Record<string, string> = {};
    if (filters.type) params.type = filters.type;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.status) params.status = filters.status;
    if (filters.location) params.location = filters.location;

    const res = await api.get<Item[]>('/api/v1/items', { params });
    return res.data;
  },

  async getItemById(id: string): Promise<Item> {
    const res = await api.get<Item>(`/api/v1/items/${id}`);
    return res.data;
  },

  async createItem(request: CreateItemRequest): Promise<Item> {
    const currentUserJson = localStorage.getItem('findora_user');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

    // Transform request to match backend ItemRequest DTO (imageUrls list)
    const payload = {
      title: request.title,
      description: request.description,
      category: request.category,
      type: request.type,
      location: request.location,
      date: request.date || new Date().toISOString(),
      imageUrls: request.imageUrls || [],
      reportedBy: currentUser?.id
    };

    const res = await api.post<Item>('/api/v1/items', payload);
    return res.data;
  },

  async updateItem(id: string, request: UpdateItemRequest): Promise<Item> {
    const payload = {
      title: request.title,
      description: request.description,
      category: request.category,
      type: request.type,
      status: request.status,
      location: request.location,
      date: request.date,
      imageUrls: request.imageUrls || [],
    };

    const res = await api.put<Item>(`/api/v1/items/${id}`, payload);
    return res.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/api/v1/items/${id}`);
  },

  async updateItemStatus(id: string, status: ItemStatus): Promise<Item> {
    const res = await api.patch<Item>(`/api/v1/items/${id}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  // --- CLAIM METHODS ---

  async submitClaim(id: string, claimData: { claimerId: number; proofDescription: string; contactPhone: string }): Promise<Item> {
    const res = await api.post<Item>(`/api/v1/items/${id}/claims`, claimData);
    return res.data;
  },

  async resolveClaim(id: string, claimId: string, status: 'APPROVED' | 'REJECTED'): Promise<Item> {
    const res = await api.patch<Item>(`/api/v1/items/${id}/claims/${claimId}/status`, null, {
      params: { status }
    });
    return res.data;
  }
};