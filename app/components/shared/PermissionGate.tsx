"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "@/app/utils/permissionChecker";
import { Permission } from "@/app/utils/permissions";

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // If true, user must have all permissions (default: false - any permission)
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 * Use this to hide/show UI elements based on what the user can do
 */
export default function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  // Check single permission
  if (permission) {
    const hasAccess = hasPermission(user, permission);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(user, permissions)
      : hasAnyPermission(user, permissions);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // No permissions specified, show children
  return <>{children}</>;
}
