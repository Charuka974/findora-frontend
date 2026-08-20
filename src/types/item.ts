export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'OPEN' | 'RESOLVED';

export const ITEM_CATEGORIES = [
  'Wallet',
  'Phone',
  'Keys',
  'Bag',
  'Laptop',
  'ID Card',
  'Documents',
  'Jewelry',
  'Clothing',
  'Electronics',
  'Other',
] as const;

export type ItemCategory = typeof ITEM_CATEGORIES[number];

export interface Item {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  userId: string;
  media: string[];
  createdAt: string;
  updatedAt: string;
  // Included to support display of owner details if present:
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

export interface CreateItemRequest {
  title: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  media: string[];
  createdAt?: string;
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  type?: ItemType;
  category?: ItemCategory;
  status?: ItemStatus;
  location?: string;
  media?: string[];
  createdAt?: string;
}
