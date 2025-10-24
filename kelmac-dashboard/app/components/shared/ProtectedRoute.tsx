'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional role-based access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (roles && !roles.includes(user?.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, router, roles]);

  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
