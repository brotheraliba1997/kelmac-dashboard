import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
  getUserPermissions,
  isAdmin,
  isInstructor,
  isCorporate,
  isFinance,
  isOperator,
  canAccessRoute,
} from "@/app/utils/permissionChecker";
import { Permission } from "@/app/utils/permissions";

/**
 * Hook to check user permissions
 * Use this in components to conditionally render or enable/disable features
 */
export function usePermissions() {
  const { user } = useSelector((state: RootState) => state.auth);

  return {
    // Permission checks
    hasPermission: (permission: Permission) =>
      checkPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      checkAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      checkAllPermissions(user, permissions),
    canAccessRoute: (route: string) => canAccessRoute(user, route),

    // Get all permissions
    permissions: getUserPermissions(user),

    // Role checks
    isAdmin: isAdmin(user),
    isInstructor: isInstructor(user),
    isCorporate: isCorporate(user),
    isFinance: isFinance(user),
    isOperator: isOperator(user),

    // User object
    user,
  };
}
