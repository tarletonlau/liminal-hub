import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ENGINEER' | 'PRODUCT' | 'DESIGN';
  avatar?: string;
}

export enum AppCategory {
  DEV_TOOLS = 'DEV_TOOLS',
  HR_ADMIN = 'HR_ADMIN',
  PRODUCTIVITY = 'PRODUCTIVITY',
  ANALYTICS = 'ANALYTICS',
}

export interface InternalTool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
  category: AppCategory;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  accessLevel: ('ADMIN' | 'ENGINEER' | 'PRODUCT' | 'DESIGN')[];
}

export interface MarqueeItem {
  id: string;
  text: string;
  highlight: boolean;
  color?: 'bg-brutal-black text-white' | 'bg-brutal-red text-white' | 'bg-brutal-yellow text-black';
}