/**
 * Protected Route and RBAC Components
 * Clean rewrite focusing on core functionality
 */

import React from 'react';
import { useAuth } from '../../hooks/useAuth';

// Simple types for this component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
  showError?: boolean;
}

/**
 * Protected Route Component
 * Simple authentication check without complex RBAC
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  showError = true
}) => {
  const { user, isAuthenticated } = useAuth();

  // Check authentication first
  if (!isAuthenticated || !user) {
    return fallback || (showError ? (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access this content.
          </p>
        </div>
      </div>
    ) : null);
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string | string[];
  fallback?: React.ReactNode;
  mode?: 'any' | 'all';
}

/**
 * Role Guard Component
 * Simple role-based content display
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // For now, just show content if user exists
  // TODO: Implement proper role checking when RBAC system is rebuilt
  return <>{children}</>;
};

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string | string[];
  fallback?: React.ReactNode;
  mode?: 'any' | 'all';
}

/**
 * Permission Guard Component
 * Simple permission-based content display
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // For now, just show content if user exists
  // TODO: Implement proper permission checking when RBAC system is rebuilt
  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: React.ReactNode;
  condition: (user: unknown) => boolean;
  fallback?: React.ReactNode;
}

/**
 * Conditional Render Component
 * Custom condition-based rendering
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  condition,
  fallback = null
}) => {
  const { user } = useAuth();

  return condition(user) ? <>{children}</> : <>{fallback}</>;
};

interface UserRoleBadgeProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * User Role Badge Component
 * Simple user role display
 */
export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  className = '',
  showIcon = true
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        bg-blue-100 text-blue-700 border border-blue-200
        ${className}
      `}
    >
      {showIcon && <span>👤</span>}
      <span>User</span>
    </span>
  );
};

// Simple error boundary
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProtectedRoute Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRouteWithErrorBoundary: React.FC<ProtectedRouteProps> = (props) => (
  <ErrorBoundary>
    <ProtectedRoute {...props} />
  </ErrorBoundary>
);

export default React.memo(ProtectedRouteWithErrorBoundary);
