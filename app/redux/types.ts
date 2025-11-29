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
