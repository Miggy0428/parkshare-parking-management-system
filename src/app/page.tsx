'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../lib/auth-service';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const user = AuthService.getCurrentUser();
    if (user) {
      // Redirect to appropriate dashboard
      AuthService.redirectToDashboard();
    } else {
      // Redirect to login
      router.push('/login');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🅿️</div>
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
