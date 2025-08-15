'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme } from '../../lib/theme';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'admin@parkshare.com', password: 'demo123', role: 'admin', name: 'System Administrator' },
    { email: 'municipal@city.gov', password: 'demo123', role: 'municipal', name: 'City Parking Authority' },
    { email: 'business@mall.com', password: 'demo123', role: 'establishment', name: 'Downtown Mall' },
    { email: 'driver@email.com', password: 'demo123', role: 'driver', name: 'Mike Johnson' },
    { email: 'scanner@parkshare.com', password: 'demo123', role: 'scanner', name: 'QR Scanner Operator' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check demo accounts
      const account = demoAccounts.find(acc => acc.email === email && acc.password === password);
      
      if (!account) {
        throw new Error('Invalid email or password');
      }

      // Store user session
      localStorage.setItem('parkshare_user', JSON.stringify({
        email: account.email,
        role: account.role,
        name: account.name,
        loginTime: new Date().toISOString()
      }));

      // Redirect to appropriate dashboard
      const dashboardRoutes = {
        admin: '/admin',
        municipal: '/municipal',
        establishment: '/establishment',
        driver: '/driver',
        scanner: '/scanner'
      };

      router.push(dashboardRoutes[account.role as keyof typeof dashboardRoutes]);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: theme.gradients.primary,
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: theme.colors.text.light }}
          >
            ParkShare!
          </h1>
          <p 
            className="text-lg"
            style={{ color: theme.colors.text.light, opacity: 0.9 }}
          >
            Parking made easy!
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.light }}
              >
                Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/30"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: theme.colors.text.light,
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.light }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/30"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: theme.colors.text.light,
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="p-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: theme.colors.text.light,
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: theme.colors.text.light,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.light, opacity: 0.9 }}
            >
              Don't have an account?{' '}
              <button 
                className="font-medium underline hover:no-underline"
                style={{ color: theme.colors.text.light }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div 
          className="mt-8 p-4 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h3 
            className="text-sm font-medium mb-3 text-center"
            style={{ color: theme.colors.text.light }}
          >
            Demo Accounts - Click to Login
          </h3>
          
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(account)}
                className="p-3 rounded-lg text-left transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p 
                      className="font-medium text-sm"
                      style={{ color: theme.colors.text.light }}
                    >
                      {account.name}
                    </p>
                    <p 
                      className="text-xs opacity-80"
                      style={{ color: theme.colors.text.light }}
                    >
                      {account.email}
                    </p>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded-full capitalize"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: theme.colors.text.light,
                    }}
                  >
                    {account.role}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <p 
            className="text-xs text-center mt-3 opacity-80"
            style={{ color: theme.colors.text.light }}
          >
            All demo accounts use password: demo123
          </p>
        </div>
      </div>
    </div>
  );
}
