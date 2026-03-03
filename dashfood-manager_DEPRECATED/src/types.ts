import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WorkspaceType = 'restaurant' | 'supermarket' | 'pharmacy';

export interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'delivered';
  timestamp: string;
  type: 'delivery' | 'pickup';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  modifiers: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}
