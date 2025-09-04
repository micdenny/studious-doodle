export type UserRole = 'admin' | 'user' | 'guest';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  profileImage?: string;
}