export interface User {
  email: string;
  role: 'admin' | 'municipal' | 'establishment' | 'driver' | 'scanner';
  name: string;
  loginTime: string;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'parkshare_user';

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Check if session is still valid (24 hours)
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        this.logout();
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user can access a specific route
   */
  static canAccessRoute(route: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const routePermissions = {
      '/admin': ['admin'],
      '/municipal': ['municipal', 'admin'],
      '/establishment': ['establishment', 'admin'],
      '/driver': ['driver'],
      '/scanner': ['scanner', 'municipal', 'establishment', 'admin']
    };

    const allowedRoles = routePermissions[route as keyof typeof routePermissions];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  }

  /**
   * Logout user
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      window.location.href = '/login';
    }
  }

  /**
   * Get user display name
   */
  static getUserDisplayName(): string {
    const user = this.getCurrentUser();
    return user?.name || 'User';
  }

  /**
   * Get user role display name
   */
  static getRoleDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';

    const roleNames = {
      admin: 'System Administrator',
      municipal: 'Municipal Authority',
      establishment: 'Business Owner',
      driver: 'Driver',
      scanner: 'Scanner Operator'
    };

    return roleNames[user.role] || user.role;
  }

  /**
   * Redirect to appropriate dashboard based on user role
   */
  static redirectToDashboard(): void {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const dashboardRoutes = {
      admin: '/admin',
      municipal: '/municipal',
      establishment: '/establishment',
      driver: '/driver',
      scanner: '/scanner'
    };

    window.location.href = dashboardRoutes[user.role];
  }

  /**
   * Check authentication and redirect if needed
   */
  static requireAuth(requiredRole?: string): User | null {
    const user = this.getCurrentUser();
    
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return user;
  }

  /**
   * Demo login function for testing
   */
  static async demoLogin(email: string, password: string): Promise<User> {
    const demoAccounts = [
      { email: 'admin@parkshare.com', password: 'demo123', role: 'admin' as const, name: 'System Administrator' },
      { email: 'municipal@city.gov', password: 'demo123', role: 'municipal' as const, name: 'City Parking Authority' },
      { email: 'business@mall.com', password: 'demo123', role: 'establishment' as const, name: 'Downtown Mall' },
      { email: 'driver@email.com', password: 'demo123', role: 'driver' as const, name: 'Mike Johnson' },
      { email: 'scanner@parkshare.com', password: 'demo123', role: 'scanner' as const, name: 'QR Scanner Operator' }
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const account = demoAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (!account) {
      throw new Error('Invalid email or password');
    }

    const user: User = {
      email: account.email,
      role: account.role,
      name: account.name,
      loginTime: new Date().toISOString()
    };

    // Store user session
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  }
}

// Export for convenience
export const authService = AuthService;
