export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'OPEN' | 'CLAIM_PENDING' | 'CLAIMED' | 'RESOLVED';

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

export interface Claim {
  claimId: string;
  claimerId: number;
  claimerName?: string;
  claimerEmail?: string;
  proofDescription: string;
  contactPhone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: ItemType;
  status: ItemStatus;
  location: string;
  date?: string;
  imageUrls: string[]; 
  reportedBy?: number;
  createdAt: string;
  updatedAt: string;
  claims?: Claim[];
  
  // Optional display fields
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

export interface CreateItemRequest {
  title: string;
  description: string;
  category: ItemCategory;
  type: ItemType;
  location: string;
  date?: string;
  imageUrls: string[]; 
  reportedBy?: number;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

export interface SubmitClaimRequest {
  claimerId: number;
  claimerName?: string;
  proofDescription: string;
  contactPhone: string;
  contactEmail?: string;
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  category?: ItemCategory;
  type?: ItemType;
  status?: ItemStatus;
  location?: string;
  date?: string;
  imageUrls?: string[]; 
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}