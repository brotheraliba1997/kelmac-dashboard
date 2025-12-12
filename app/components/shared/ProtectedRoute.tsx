"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/app/redux/slices/auth";
import {
  canAccessRoute,
  getUserRole,
  hasPermission,
} from "@/app/utils/permissionChecker";
import { Permission } from "@/app/utils/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional role-based access
  permissions?: Permission[]; // optional permission-based access
  requireAll?: boolean; // require all permissions (default: false - any permission)
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  permissions,
  requireAll = false,
  fallback,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { user, isAuthenticated, token } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    // Check if token exists
    if (!token || !isAuthenticated) {
      dispatch(logout());
      router.push("/login");
      return;
    }

    // Reject unknown or student roles
    const roleId = getUserRole(user);
    if (!roleId || user?.role === "student") {
      dispatch(logout());
      router.push("/login");
      return;
    }

    // Check role-based access (legacy support)
    if (roles && user && !roles.includes(user?.role)) {
      router.push("/dashboard");
      return;
    }

    // Check permission-based access
    if (permissions && user) {
      const hasAccess = requireAll
        ? permissions.every((perm) => hasPermission(user, perm))
        : permissions.some((perm) => hasPermission(user, perm));

      if (!hasAccess) {
        router.push("/dashboard");
        return;
      }
    }

    // Check route-level permissions
    if (!canAccessRoute(user, pathname)) {
      router.push("/dashboard");
    }
  }, [
    isAuthenticated,
    user,
    token,
    router,
    roles,
    permissions,
    requireAll,
    pathname,
    dispatch,
  ]);

  if (!isAuthenticated || !token) {
    return (
      fallback || (
        <div
          className="flex justify-center items-center"
          style={{ height: "100vh" }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    );
  }

  // Check if user has access
  const hasRoleAccess = !roles || (user && roles.includes(user?.role));
  const hasPermAccess =
    !permissions ||
    (requireAll
      ? permissions.every((perm) => hasPermission(user, perm))
      : permissions.some((perm) => hasPermission(user, perm)));
  const hasRouteAccess = canAccessRoute(user, pathname);

  if (!hasRoleAccess || !hasPermAccess || !hasRouteAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
