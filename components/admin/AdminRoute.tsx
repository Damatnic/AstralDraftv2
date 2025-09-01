/**
 * Admin Route Component
 * Protected route for admin dashboard access with authentication
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useState, useEffect } from &apos;react&apos;;
import { adminService, AdminUser } from &apos;../../services/adminService&apos;;
import AdminDashboard from &apos;./AdminDashboard&apos;;

interface AdminLoginProps {
}
  onLogin: (admin: AdminUser) => void;

}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin  }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [credentials, setCredentials] = useState({ username: &apos;&apos;, password: &apos;&apos; });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(&apos;&apos;);

  const handleSubmit = async (e: React.FormEvent) => {
}
    e.preventDefault();
    setLoading(true);
    setError(&apos;&apos;);

    try {
}

      const admin = await adminService.authenticateAdmin(credentials.username, credentials.password);
      if (admin) {
}
        onLogin(admin);
      } else {
}
        setError(&apos;Invalid credentials. Please try again.&apos;);
      }
    } catch (error) {
}
      setError(&apos;Authentication failed. Please try again.&apos;);
    } finally {
}
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">Admin Access</h1>
          <p className="mt-2 text-gray-600 sm:px-4 md:px-6 lg:px-8">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:px-4 md:px-6 lg:px-8">
//               Username
            </label>
            <input
              id="username"
              type="text"
//               required
              value={credentials.username}
              onChange={(e: any) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:px-4 md:px-6 lg:px-8"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sm:px-4 md:px-6 lg:px-8">
//               Password
            </label>
            <input
              id="password"
              type="password"
//               required
              value={credentials.password}
              onChange={(e: any) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:px-4 md:px-6 lg:px-8"
              placeholder="Enter your password"
            />
          </div>

          {error && (
}
            <div className="bg-red-50 border border-red-200 rounded-md p-4 sm:px-4 md:px-6 lg:px-8">
              <div className="flex sm:px-4 md:px-6 lg:px-8">
                <div className="flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">⚠️</span>
                </div>
                <div className="ml-3 sm:px-4 md:px-6 lg:px-8">
                  <p className="text-sm text-red-700 sm:px-4 md:px-6 lg:px-8">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
}
//               loading
                ? &apos;bg-gray-400 cursor-not-allowed&apos;
                : &apos;bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500&apos;
            }`}
           aria-label="Action button">
            {loading ? &apos;Signing in...&apos; : &apos;Sign In&apos;}
          </button>
        </form>

        <div className="mt-6 text-center sm:px-4 md:px-6 lg:px-8">
          <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
            Access requires valid credentials
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminRoute: React.FC = () => {
}
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
}
    // Check if admin is already logged in (in a real app, this would check tokens/sessions)
    const savedAdmin = localStorage.getItem(&apos;astral_admin&apos;);
    if (savedAdmin) {
}
      try {
}

        const admin = JSON.parse(savedAdmin);
        setCurrentAdmin(admin);
      } catch (error) {
}
        localStorage.removeItem(&apos;astral_admin&apos;);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (admin: AdminUser) => {
}
    setCurrentAdmin(admin);
    localStorage.setItem(&apos;astral_admin&apos;, JSON.stringify(admin));
  };

  const handleLogout = () => {
}
    setCurrentAdmin(null);
    localStorage.removeItem(&apos;astral_admin&apos;);
  };

  if (loading) {
}
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-xl font-semibold text-gray-600 sm:px-4 md:px-6 lg:px-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentAdmin) {
}
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Admin header with logout */}
      <div className="bg-blue-600 text-white px-4 py-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center space-x-4 sm:px-4 md:px-6 lg:px-8">
            <span className="font-medium sm:px-4 md:px-6 lg:px-8">Logged in as: {currentAdmin.username}</span>
            <span className="text-blue-200 sm:px-4 md:px-6 lg:px-8">Role: {currentAdmin.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md text-sm font-medium sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
//             Logout
          </button>
        </div>
      </div>
      
      <AdminDashboard />
    </div>
  );
};

const AdminRouteWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AdminRoute {...props} />
  </ErrorBoundary>
);

export default React.memo(AdminRouteWithErrorBoundary);
