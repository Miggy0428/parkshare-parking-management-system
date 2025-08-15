'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService, User } from '../lib/auth-service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // Check role permissions
      if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
        router.push('/login');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(currentUser.role) && currentUser.role !== 'admin') {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router, requiredRole, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}

// Header component with user info and logout
export function DashboardHeader({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="dashboard-header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-4">
          {children}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{AuthService.getRoleDisplayName()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
