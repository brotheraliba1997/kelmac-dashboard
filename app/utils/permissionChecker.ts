import {
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  ROUTE_PERMISSIONS,
} from "./permissions";

/**
 * Get role ID from user object
 */
export function getUserRole(user: any): UserRole | null {
  if (!user) return null;

  // Handle role as object { id: number }
  if (typeof user.role === "object" && user.role?.id) {
    const roleId = user.role.id as UserRole;
    return ROLE_PERMISSIONS[roleId] ? roleId : null;
  }

  // Handle role as number
  if (typeof user.role === "number") {
    const roleId = user.role as UserRole;
    return ROLE_PERMISSIONS[roleId] ? roleId : null;
  }

  return null;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: any, permission: Permission): boolean {
  const roleId = getUserRole(user);

  if (!roleId) return false;

  const rolePermissions = ROLE_PERMISSIONS[roleId];
  return rolePermissions?.includes(permission) ?? false;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: any,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: any,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(user: any, route: string): boolean {
  // Extract base route without dynamic segments
  const baseRoute = route.split("/").slice(0, -1).join("/");

  // Check exact match first
  const exactPermissions = ROUTE_PERMISSIONS[route];
  if (exactPermissions) {
    return hasAnyPermission(user, exactPermissions);
  }

  // Check base route
  const basePermissions = ROUTE_PERMISSIONS[baseRoute];
  if (basePermissions) {
    return hasAnyPermission(user, basePermissions);
  }

  // If no specific permissions required, allow access
  return true;
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: any): Permission[] {
  const roleId = getUserRole(user);

  if (!roleId) return [];

  return ROLE_PERMISSIONS[roleId] ?? [];
}

/**
 * Check if user is admin
 */
export function isAdmin(user: any): boolean {
  return getUserRole(user) === UserRole.ADMIN;
}

/**
 * Check if user is instructor
 */
export function isInstructor(user: any): boolean {
  return getUserRole(user) === UserRole.INSTRUCTOR;
}

/**
 * Check if user is corporate
 */
export function isCorporate(user: any): boolean {
  return getUserRole(user) === UserRole.CORPORATE;
}

/**
 * Check if user is finance
 */
export function isFinance(user: any): boolean {
  return getUserRole(user) === UserRole.FINANCE;
}

/**
 * Check if user is operator
 */
export function isOperator(user: any): boolean {
  return getUserRole(user) === UserRole.OPERATOR;
}

/**
 * Filter data based on user role
 * For example, restrict by ownership where required
 */
export function filterDataByRole<T extends Record<string, any>>(
  user: any,
  data: T[],
  dataType: "enrollments" | "attendance" | "certificates" | "users"
): T[] {
  const roleId = getUserRole(user);

  // Admin sees everything
  if (roleId === UserRole.ADMIN) {
    return data;
  }

  // Instructors see data for their classes
  if (roleId === UserRole.INSTRUCTOR) {
    return data.filter((item) => {
      const instructorId = item.instructorId || item.instructor?.id;
      return instructorId === user.id || instructorId === user._id;
    });
  }

  // Corporate users see data for their company
  if (roleId === UserRole.CORPORATE) {
    return data.filter((item) => {
      const companyId = item.companyId || item.company?.id;
      return companyId === user.companyId;
    });
  }

  // Finance sees everything (for reporting purposes)
  if (roleId === UserRole.FINANCE) {
    return data;
  }

  // Operators see everything (for operational purposes)
  if (roleId === UserRole.OPERATOR) {
    return data;
  }

  return data;
}
