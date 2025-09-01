import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { useAuth } from &apos;../../contexts/AuthContext&apos;;
import { rbacService, UserRole, Permission, type UserWithRoles } from &apos;../../services/rbacService&apos;;

interface ProtectedRouteProps {
}
  children: React.ReactNode;
  requiredPermissions?: Permission | Permission[];
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  showError?: boolean;

/**
 * Protected Route Component
 * Wraps content that requires specific permissions or roles
 */
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
}
  children,
  requiredPermissions,
  requiredRole,
  fallback,
  showError = true
}: any) => {
}
  const { user, isAuthenticated } = useAuth();
  
  // Convert user to UserWithRoles format (assuming roles are available)
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER] // Default to USER role if not specified
  } : null;

  // Check authentication first
  if (!isAuthenticated || !userWithRoles) {
}
    return fallback || (showError ? (
      <div className="flex items-center justify-center p-8 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-red-500 text-xl mb-2 sm:px-4 md:px-6 lg:px-8">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:px-4 md:px-6 lg:px-8">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
            Please log in to access this content.
          </p>
        </div>
      </div>
    ) : null);

  // Check role requirements
  if (requiredRole && !rbacService.hasMinimumRole(userWithRoles, requiredRole)) {
}
    return fallback || (showError ? (
      <div className="flex items-center justify-center p-8 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-red-500 text-xl mb-2 sm:px-4 md:px-6 lg:px-8">⛔</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:px-4 md:px-6 lg:px-8">
            Insufficient Role
          </h3>
          <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
            You need {rbacService.getRoleConfig(requiredRole).name} role or higher to access this content.
          </p>
        </div>
      </div>
    ) : null);

  // Check permission requirements
  if (requiredPermissions) {
}
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    if (!rbacService.hasAllPermissions(userWithRoles, permissions)) {
}
      return fallback || (showError ? (
        <div className="flex items-center justify-center p-8 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-red-500 text-xl mb-2 sm:px-4 md:px-6 lg:px-8">🚫</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:px-4 md:px-6 lg:px-8">
              Insufficient Permissions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 sm:px-4 md:px-6 lg:px-8">
              You don&apos;t have the required permissions to access this content.
            </p>
          </div>
        </div>
      ) : null);


  return <>{children}</>;
};

interface RoleGuardProps {
}
  children: React.ReactNode;
  roles: UserRole | UserRole[];
  fallback?: React.ReactNode;
  mode?: &apos;any&apos; | &apos;all&apos;; // whether user needs any of the roles or all of them

/**
 * Role Guard Component
 * Show/hide content based on user roles
 */
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
}
  children,
  roles,
  fallback = null,
  mode = &apos;any&apos;
}: any) => {
}
  const { user } = useAuth();
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER]
  } : null;

  const rolesArray = Array.isArray(roles) ? roles : [roles];
  
  const hasAccess = mode === &apos;any&apos; 
    ? rolesArray.some((role: any) => rbacService.hasRole(userWithRoles, role))
    : rolesArray.every((role: any) => rbacService.hasRole(userWithRoles, role));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface PermissionGuardProps {
}
  children: React.ReactNode;
  permissions: Permission | Permission[];
  fallback?: React.ReactNode;
  mode?: &apos;any&apos; | &apos;all&apos;;

/**
 * Permission Guard Component
 * Show/hide content based on user permissions
 */
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
}
  children,
  permissions,
  fallback = null,
  mode = &apos;all&apos;
}: any) => {
}
  const { user } = useAuth();
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER]
  } : null;

  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  const hasAccess = mode === &apos;any&apos;
    ? rbacService.hasAnyPermission(userWithRoles, permissionsArray)
    : rbacService.hasAllPermissions(userWithRoles, permissionsArray);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface ConditionalRenderProps {
}
  children: React.ReactNode;
  condition: (user: UserWithRoles | null) => boolean;
  fallback?: React.ReactNode;

/**
 * Conditional Render Component
 * Custom condition-based rendering
 */
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
}
  children,
  condition,
  fallback = null
}: any) => {
}
  const { user } = useAuth();
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER]
  } : null;

  return condition(userWithRoles) ? <>{children}</> : <>{fallback}</>;
};

interface UserRoleBadgeProps {
}
  className?: string;
  showIcon?: boolean;

/**
 * User Role Badge Component
 * Displays the user&apos;s highest role as a badge
 */
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
}
  className = &apos;&apos;,
  showIcon = true
}: any) => {
}
  const { user } = useAuth();
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER]
  } : null;

  if (!userWithRoles) {
}
    return null;

  const highestRole = rbacService.getHighestRole(userWithRoles);
  const roleConfig = rbacService.getRoleConfig(highestRole);

  return (
    <span
      className={`
}
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        ${className}
      `}
      style={{
}
        backgroundColor: `${roleConfig.color}20`,
        color: roleConfig.color,
        border: `1px solid ${roleConfig.color}40`
      }}
    >
      {showIcon && <span>{roleConfig.icon}</span>}
      <span>{roleConfig.name}</span>
    </span>
  );
};

interface PermissionListProps {
}
  className?: string;
  showCategories?: boolean;

/**
 * Permission List Component
 * Displays all permissions for the current user
 */
}

export const PermissionList: React.FC<PermissionListProps> = ({
}
  className = &apos;&apos;,
  showCategories = true
}: any) => {
}
  const { user } = useAuth();
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER]
  } : null;

  if (!userWithRoles) {
}
    return null;

  const permissions = rbacService.getUserPermissions(userWithRoles);
  
  // Group permissions by category if requested
  const groupedPermissions = showCategories ? {
}
    &apos;User&apos;: permissions.filter((p: any) => p.includes(&apos;profile&apos;) || p.includes(&apos;dashboard&apos;)),
    &apos;League&apos;: permissions.filter((p: any) => p.includes(&apos;league&apos;)),
    &apos;Draft&apos;: permissions.filter((p: any) => p.includes(&apos;draft&apos;)),
    &apos;Oracle&apos;: permissions.filter((p: any) => p.includes(&apos;oracle&apos;)),
    &apos;Analytics&apos;: permissions.filter((p: any) => p.includes(&apos;analytics&apos;)),
    &apos;Social&apos;: permissions.filter((p: any) => p.includes(&apos;post&apos;) || p.includes(&apos;comment&apos;)),
    &apos;Admin&apos;: permissions.filter((p: any) => p.includes(&apos;manage&apos;) || p.includes(&apos;admin&apos;))
  } : { &apos;All Permissions&apos;: permissions };

  return (
    <div className={`permission-list ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 sm:px-4 md:px-6 lg:px-8">
        Your Permissions
      </h4>
      
      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
}
          categoryPermissions.length > 0 && (
            <div key={category}>
              {showCategories && (
}
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">
                  {category}
                </h5>
              )}
              <div className="flex flex-wrap gap-1 sm:px-4 md:px-6 lg:px-8">
                {categoryPermissions.map((permission: Permission) => (
}
                  <span
                    key={permission}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded sm:px-4 md:px-6 lg:px-8"
                  >
                    {permission.replace(/_/g, &apos; &apos;).toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

// Hooks for easier access to RBAC functionality
export const useRBAC = () => {
}
  const { user } = useAuth();
  const userWithRoles: UserWithRoles | null = user ? {
}
    ...user,
    roles: (user as any).roles || [UserRole.USER]
  } : null;

  return {
}
    user: userWithRoles,
    hasPermission: (permission: Permission) => rbacService.hasPermission(userWithRoles, permission),
    hasAnyPermission: (permissions: Permission[]) => rbacService.hasAnyPermission(userWithRoles, permissions),
    hasAllPermissions: (permissions: Permission[]) => rbacService.hasAllPermissions(userWithRoles, permissions),
    hasRole: (role: UserRole) => rbacService.hasRole(userWithRoles, role),
    hasMinimumRole: (role: UserRole) => rbacService.hasMinimumRole(userWithRoles, role),
    getHighestRole: () => rbacService.getHighestRole(userWithRoles),
    getUserPermissions: () => rbacService.getUserPermissions(userWithRoles),
    canAccess: (feature: string) => {
}
      const featurePermissions = rbacService.getFeaturePermissions()[feature];
      return !featurePermissions || rbacService.hasAllPermissions(userWithRoles, featurePermissions);

  };
};

const ProtectedRouteWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ProtectedRoute {...props} />
  </ErrorBoundary>
);

export default React.memo(ProtectedRouteWithErrorBoundary);
