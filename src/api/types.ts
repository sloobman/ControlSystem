export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'foreman' | 'manager';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'engineer' | 'foreman' | 'manager';
}

export interface Defect {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  assignedTo?: User;
  assignedToId?: string;
  createdBy: User;
  createdById: string;
  photos: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  authorId: string;
  createdAt: string;
}

export interface CreateDefectRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  assignedToId?: string;
  photos?: string[];
}

export interface UpdateDefectRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  assignedToId?: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}
