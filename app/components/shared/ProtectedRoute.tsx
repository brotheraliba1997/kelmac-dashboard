"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/app/redux/slices/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional role-based access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const router = useRouter();
  const dispatch = useDispatch();
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

    // Check role-based access
    if (roles && user && !roles.includes(user?.role)) {
      router.push("/unauthorized");
    }
  }, [isAuthenticated, user, token, router, roles, dispatch]);

  if (!isAuthenticated || !token) {
    return (
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
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
