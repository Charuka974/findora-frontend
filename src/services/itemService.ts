import api from './api';
import type { Item, CreateItemRequest, UpdateItemRequest, ItemType, ItemStatus } from '../types/item';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to seed initial mock items if they don't exist in localStorage
const seedMockItems = (): Item[] => {
  const existing = localStorage.getItem('findora_mock_items');
  if (existing) {
    return JSON.parse(existing);
  }

  const defaultItems: Item[] = [
    {
      id: 'mock_item_1',
      title: 'Black Leather Wallet',
      description: 'Found a black leather trifold wallet near the library entrance. Contains some cash but no ID cards. Please contact to identify details.',
      type: 'FOUND',
      category: 'Wallet',
      status: 'OPEN',
      location: 'Library Entrance, Main Campus',
      userId: 'user_mock_2',
      media: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      ownerName: 'Sarah Jenkins',
      ownerEmail: 'sarah.j@example.com',
      ownerPhone: '+1 (555) 123-4567',
    },
    {
      id: 'mock_item_2',
      title: 'iPhone 15 Pro - Space Gray',
      description: 'Lost my iPhone 15 Pro in a black Silicon case in the Student Union Cafeteria. It has a lock screen wallpaper of a golden retriever.',
      type: 'LOST',
      category: 'Phone',
      status: 'OPEN',
      location: 'Student Union Cafeteria',
      userId: 'user_mock_1',
      media: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      ownerName: 'Charuka',
      ownerEmail: 'charuka@example.com',
      ownerPhone: '+1 (555) 987-6543',
    },
    {
      id: 'mock_item_3',
      title: 'Silver Keychain with 4 Keys',
      description: 'Found a silver keychain holding four brass keys and a blue plastic gym tag near the Science Hall lockers.',
      type: 'FOUND',
      category: 'Keys',
      status: 'OPEN',
      location: 'Science Hall Corridor B',
      userId: 'user_mock_3',
      media: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      ownerName: 'Professor Marcus',
      ownerEmail: 'marcus@example.com',
      ownerPhone: '+1 (555) 456-7890',
    },
    {
      id: 'mock_item_4',
      title: 'Dell XPS 13 Laptop',
      description: 'Lost my Dell XPS 13 laptop. It has a couple of stickers on the back lid: a React logo and a GitHub octocat sticker. Left in Room 304 of Engineering Block.',
      type: 'LOST',
      category: 'Laptop',
      status: 'RESOLVED',
      location: 'Engineering Block, Room 304',
      userId: 'user_mock_1',
      media: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      ownerName: 'Charuka',
      ownerEmail: 'charuka@example.com',
      ownerPhone: '+1 (555) 987-6543',
    },
    {
      id: 'mock_item_5',
      title: 'Blue Fjallraven Kanken Backpack',
      description: 'Left my blue backpack in the lecture theatre hall. Inside there is an organic chemistry textbook and a green water bottle.',
      type: 'LOST',
      category: 'Bag',
      status: 'OPEN',
      location: 'Campus Auditorium / Main Hall',
      userId: 'user_mock_4',
      media: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(), // 4 days ago
      updatedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
      ownerName: 'Michael Chang',
      ownerEmail: 'michael@example.com',
      ownerPhone: '+1 (555) 321-7654',
    },
    {
      id: 'mock_item_6',
      title: 'Student ID Card - Emily Watson',
      description: 'Found a plastic campus card under the benches of the basketball courts. Name on the card is Emily Watson.',
      type: 'FOUND',
      category: 'ID Card',
      status: 'OPEN',
      location: 'Outdoor Basketball Courts',
      userId: 'user_mock_2',
      media: [],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      ownerName: 'Sarah Jenkins',
      ownerEmail: 'sarah.j@example.com',
      ownerPhone: '+1 (555) 123-4567',
    },
  ];

  localStorage.setItem('findora_mock_items', JSON.stringify(defaultItems));
  return defaultItems;
};

export const itemService = {
  async getItems(filters: {
    type?: ItemType | '';
    category?: string | '';
    status?: ItemStatus | '';
    search?: string;
    location?: string;
    sort?: string;
    userId?: string;
  } = {}): Promise<Item[]> {
    if (USE_MOCK) {
      await delay();
      let items = seedMockItems();

      // Apply Filters
      if (filters.type) {
        items = items.filter((item) => item.type === filters.type);
      }
      if (filters.category && filters.category !== 'All') {
        items = items.filter((item) => item.category === filters.category);
      }
      if (filters.status) {
        items = items.filter((item) => item.status === filters.status);
      }
      if (filters.userId) {
        items = items.filter((item) => item.userId === filters.userId);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
      }
      if (filters.location) {
        const query = filters.location.toLowerCase();
        items = items.filter((item) => item.location.toLowerCase().includes(query));
      }

      // Apply Sorting
      if (filters.sort === 'oldest') {
        items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        // Default to newest
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return items;
    }

    // Dynamic clean up of request parameters
    const params: Record<string, string> = {};
    if (filters.type) params.type = filters.type;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    if (filters.location) params.location = filters.location;
    if (filters.sort) params.sort = filters.sort;
    if (filters.userId) params.userId = filters.userId;

    const res = await api.get<Item[]>('/api/v1/items', { params });
    return res.data;
  },

  async getItemById(id: string): Promise<Item> {
    if (USE_MOCK) {
      await delay();
      const items = seedMockItems();
      const item = items.find((i) => i.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      return item;
    }

    const res = await api.get<Item>(`/api/v1/items/${id}`);
    return res.data;
  },

  async createItem(request: CreateItemRequest): Promise<Item> {
    if (USE_MOCK) {
      await delay();
      const items = seedMockItems();
      const currentUserJson = localStorage.getItem('findora_user');
      const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

      const newItem: Item = {
        id: 'mock_item_' + (Date.now()),
        title: request.title,
        description: request.description,
        type: request.type,
        category: request.category,
        status: 'OPEN',
        location: request.location,
        userId: currentUser?.id || 'anonymous_user',
        media: request.media,
        createdAt: request.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerName: currentUser?.name || 'Anonymous User',
        ownerEmail: currentUser?.email || 'anonymous@example.com',
        ownerPhone: currentUser?.phone || '',
      };

      items.push(newItem);
      localStorage.setItem('findora_mock_items', JSON.stringify(items));
      return newItem;
    }

    const res = await api.post<Item>('/api/v1/items', request);
    return res.data;
  },

  async updateItem(id: string, request: UpdateItemRequest): Promise<Item> {
    if (USE_MOCK) {
      await delay();
      const items = seedMockItems();
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) {
        throw new Error('Item not found');
      }

      const updatedItem: Item = {
        ...items[index],
        ...request,
        updatedAt: new Date().toISOString(),
      };

      items[index] = updatedItem;
      localStorage.setItem('findora_mock_items', JSON.stringify(items));
      return updatedItem;
    }

    const res = await api.put<Item>(`/api/v1/items/${id}`, request);
    return res.data;
  },

  async deleteItem(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay();
      const items = seedMockItems();
      const filtered = items.filter((i) => i.id !== id);
      localStorage.setItem('findora_mock_items', JSON.stringify(filtered));
      return;
    }

    await api.delete(`/api/v1/items/${id}`);
  },
};
