// User-related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: { id: number } | number;
  status: { id: number } | number;
  provider?: string;
  socialId?: string;
  [key: string]: any;
}
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon: string;
  color: string;
  subcategories: string[];
  courseCount: number;
  order: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Pagination structure for users
export interface UserPagination {
  currentPage: number;
  data: User[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface RoleOption {
  id: number;
  value: number;
  label: string;
}

export interface StatusOption {
  id: number;

  value: number;
  label: string;
}
