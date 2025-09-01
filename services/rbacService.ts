/**
 * Role-Based Access Control (RBAC) System
 * Provides comprehensive permission management for different user roles
 */

export enum UserRole {
}
  GUEST = &apos;guest&apos;,
  USER = &apos;user&apos;,
  LEAGUE_MANAGER = &apos;league_manager&apos;,
  ORACLE_SUBSCRIBER = &apos;oracle_subscriber&apos;,
  ORACLE_ADMIN = &apos;oracle_admin&apos;,
  ADMIN = &apos;admin&apos;,
  SUPER_ADMIN = &apos;super_admin&apos;
}

export enum Permission {
}
  // User permissions
  VIEW_DASHBOARD = &apos;view_dashboard&apos;,
  VIEW_PROFILE = &apos;view_profile&apos;,
  EDIT_PROFILE = &apos;edit_profile&apos;,
  
  // League permissions
  VIEW_LEAGUES = &apos;view_leagues&apos;,
  JOIN_LEAGUE = &apos;join_league&apos;,
  CREATE_LEAGUE = &apos;create_league&apos;,
  MANAGE_LEAGUE = &apos;manage_league&apos;,
  DELETE_LEAGUE = &apos;delete_league&apos;,
  
  // Draft permissions
  PARTICIPATE_DRAFT = &apos;participate_draft&apos;,
  VIEW_DRAFT_HISTORY = &apos;view_draft_history&apos;,
  
  // Oracle permissions
  VIEW_ORACLE_PREDICTIONS = &apos;view_oracle_predictions&apos;,
  SUBMIT_ORACLE_PREDICTIONS = &apos;submit_oracle_predictions&apos;,
  VIEW_ORACLE_ANALYTICS = &apos;view_oracle_analytics&apos;,
  ACCESS_PREMIUM_ORACLE = &apos;access_premium_oracle&apos;,
  MANAGE_ORACLE_SYSTEM = &apos;manage_oracle_system&apos;,
  
  // Analytics permissions
  VIEW_BASIC_ANALYTICS = &apos;view_basic_analytics&apos;,
  VIEW_ADVANCED_ANALYTICS = &apos;view_advanced_analytics&apos;,
  EXPORT_ANALYTICS = &apos;export_analytics&apos;,
  
  // Social permissions
  CREATE_POSTS = &apos;create_posts&apos;,
  COMMENT_ON_POSTS = &apos;comment_on_posts&apos;,
  MODERATE_CONTENT = &apos;moderate_content&apos;,
  
  // Admin permissions
  MANAGE_USERS = &apos;manage_users&apos;,
  VIEW_SYSTEM_LOGS = &apos;view_system_logs&apos;,
  MANAGE_SYSTEM_SETTINGS = &apos;manage_system_settings&apos;,
  SUPER_ADMIN_ACCESS = &apos;super_admin_access&apos;
}

// Role-Permission mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
}
  [UserRole.GUEST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_LEAGUES
  ],
  
  [UserRole.USER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_LEAGUES,
    Permission.JOIN_LEAGUE,
    Permission.PARTICIPATE_DRAFT,
    Permission.VIEW_DRAFT_HISTORY,
    Permission.VIEW_BASIC_ANALYTICS,
    Permission.CREATE_POSTS,
    Permission.COMMENT_ON_POSTS
  ],
  
  [UserRole.LEAGUE_MANAGER]: [],
  [UserRole.ORACLE_SUBSCRIBER]: [],
  [UserRole.ORACLE_ADMIN]: [],
  [UserRole.ADMIN]: [],
  [UserRole.SUPER_ADMIN]: []
};

// Fill in dependent roles after initial definition
ROLE_PERMISSIONS[UserRole.LEAGUE_MANAGER] = [
  ...ROLE_PERMISSIONS[UserRole.USER],
  Permission.CREATE_LEAGUE,
  Permission.MANAGE_LEAGUE,
  Permission.VIEW_ADVANCED_ANALYTICS,
  Permission.EXPORT_ANALYTICS,
  Permission.MODERATE_CONTENT
];

ROLE_PERMISSIONS[UserRole.ORACLE_SUBSCRIBER] = [
  ...ROLE_PERMISSIONS[UserRole.USER],
  Permission.VIEW_ORACLE_PREDICTIONS,
  Permission.SUBMIT_ORACLE_PREDICTIONS,
  Permission.VIEW_ORACLE_ANALYTICS,
  Permission.ACCESS_PREMIUM_ORACLE
];

ROLE_PERMISSIONS[UserRole.ORACLE_ADMIN] = [
  ...ROLE_PERMISSIONS[UserRole.ORACLE_SUBSCRIBER],
  Permission.MANAGE_ORACLE_SYSTEM,
  Permission.VIEW_ADVANCED_ANALYTICS,
  Permission.EXPORT_ANALYTICS
];

ROLE_PERMISSIONS[UserRole.ADMIN] = [
  ...Object.values(Permission).filter((p: any) => p !== Permission.SUPER_ADMIN_ACCESS)
];

ROLE_PERMISSIONS[UserRole.SUPER_ADMIN] = [
  ...Object.values(Permission)
];

interface RoleConfig {
}
  name: string;
  description: string;
  color: string;
  icon: string;
  priority: number;
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
}
  [UserRole.GUEST]: {
}
    name: &apos;Guest&apos;,
    description: &apos;Limited access to public features&apos;,
    color: &apos;#6B7280&apos;,
    icon: &apos;👤&apos;,
    priority: 0
  },
  [UserRole.USER]: {
}
    name: &apos;User&apos;,
    description: &apos;Standard user with basic features&apos;,
    color: &apos;#3B82F6&apos;,
    icon: &apos;🏈&apos;,
    priority: 1
  },
  [UserRole.LEAGUE_MANAGER]: {
}
    name: &apos;League Manager&apos;,
    description: &apos;Can create and manage leagues&apos;,
    color: &apos;#10B981&apos;,
    icon: &apos;⭐&apos;,
    priority: 2
  },
  [UserRole.ORACLE_SUBSCRIBER]: {
}
    name: &apos;Oracle Subscriber&apos;,
    description: &apos;Access to Oracle predictions and analytics&apos;,
    color: &apos;#8B5CF6&apos;,
    icon: &apos;🔮&apos;,
    priority: 3
  },
  [UserRole.ORACLE_ADMIN]: {
}
    name: &apos;Oracle Admin&apos;,
    description: &apos;Manages Oracle prediction system&apos;,
    color: &apos;#7C3AED&apos;,
    icon: &apos;🧙‍♂️&apos;,
    priority: 4
  },
  [UserRole.ADMIN]: {
}
    name: &apos;Administrator&apos;,
    description: &apos;Full system administration access&apos;,
    color: &apos;#EF4444&apos;,
    icon: &apos;👑&apos;,
    priority: 5
  },
  [UserRole.SUPER_ADMIN]: {
}
    name: &apos;Super Admin&apos;,
    description: &apos;Ultimate system control&apos;,
    color: &apos;#DC2626&apos;,
    icon: &apos;⚡&apos;,
    priority: 6
  }
};

export interface UserWithRoles {
}
  id: number;
  username: string;
  email: string;
  display_name: string;
  roles: UserRole[];
  permissions?: Permission[];
}

class RBACService {
}
  /**
   * Check if user has specific permission
   */
  hasPermission(user: UserWithRoles | null, permission: Permission): boolean {
}
    if (!user || !user.roles || user.roles.length === 0) {
}
      return ROLE_PERMISSIONS[UserRole.GUEST].includes(permission);
    }

    // Check if any of the user&apos;s roles has the permission
    return user.roles.some((role: any) => 
      ROLE_PERMISSIONS[role]?.includes(permission)
    );
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(user: UserWithRoles | null, permissions: Permission[]): boolean {
}
    return permissions.some((permission: any) => this.hasPermission(user, permission));
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(user: UserWithRoles | null, permissions: Permission[]): boolean {
}
    return permissions.every((permission: any) => this.hasPermission(user, permission));
  }

  /**
   * Check if user has specific role
   */
  hasRole(user: UserWithRoles | null, role: UserRole): boolean {
}
    if (!user || !user.roles) {
}
      return role === UserRole.GUEST;
    }
    return user.roles.includes(role);
  }

  /**
   * Check if user has role with equal or higher priority
   */
  hasMinimumRole(user: UserWithRoles | null, minimumRole: UserRole): boolean {
}
    if (!user || !user.roles || user.roles.length === 0) {
}
      return ROLE_CONFIGS[minimumRole].priority <= ROLE_CONFIGS[UserRole.GUEST].priority;
    }

    const userMaxPriority = Math.max(
      ...user.roles.map((role: any) => ROLE_CONFIGS[role]?.priority || 0)
    );
    
    return userMaxPriority >= ROLE_CONFIGS[minimumRole].priority;
  }

  /**
   * Get all permissions for user
   */
  getUserPermissions(user: UserWithRoles | null): Permission[] {
}
    if (!user || !user.roles || user.roles.length === 0) {
}
      return ROLE_PERMISSIONS[UserRole.GUEST];
    }

    const permissions = new Set<Permission>();
    
    user.roles.forEach((role: any) => {
}
      ROLE_PERMISSIONS[role]?.forEach((permission: any) => {
}
        permissions.add(permission);
      });
    });

    return Array.from(permissions);
  }

  /**
   * Get user&apos;s highest priority role
   */
  getHighestRole(user: UserWithRoles | null): UserRole {
}
    if (!user || !user.roles || user.roles.length === 0) {
}
      return UserRole.GUEST;
    }

    return user.roles.reduce((highest, current) => 
      ROLE_CONFIGS[current].priority > ROLE_CONFIGS[highest].priority ? current : highest
    );
  }

  /**
   * Get role configuration
   */
  getRoleConfig(role: UserRole): RoleConfig {
}
    return ROLE_CONFIGS[role];
  }

  /**
   * Get all available roles
   */
  getAllRoles(): UserRole[] {
}
    return Object.values(UserRole);
  }

  /**
   * Get assignable roles (excluding guest)
   */
  getAssignableRoles(): UserRole[] {
}
    return Object.values(UserRole).filter((role: any) => role !== UserRole.GUEST);
  }

  /**
   * Check if user can assign specific role (must have higher priority)
   */
  canAssignRole(assigner: UserWithRoles | null, targetRole: UserRole): boolean {
}
    const assignerRole = this.getHighestRole(assigner);
    return ROLE_CONFIGS[assignerRole].priority > ROLE_CONFIGS[targetRole].priority;
  }

  /**
   * Get permissions required for specific feature
   */
  getFeaturePermissions(): Record<string, Permission[]> {
}
    return {
}
      dashboard: [Permission.VIEW_DASHBOARD],
      profile: [Permission.VIEW_PROFILE],
      leagues: [Permission.VIEW_LEAGUES],
      createLeague: [Permission.CREATE_LEAGUE],
      manageLeague: [Permission.MANAGE_LEAGUE],
      draft: [Permission.PARTICIPATE_DRAFT],
      oracle: [Permission.VIEW_ORACLE_PREDICTIONS],
      oracleSubmit: [Permission.SUBMIT_ORACLE_PREDICTIONS],
      oraclePremium: [Permission.ACCESS_PREMIUM_ORACLE],
      analytics: [Permission.VIEW_BASIC_ANALYTICS],
      advancedAnalytics: [Permission.VIEW_ADVANCED_ANALYTICS],
      admin: [Permission.MANAGE_USERS]
    };
  }

  /**
   * Filter resources based on user permissions
   */
  filterAllowed<T>(
    user: UserWithRoles | null, 
    resources: Array<T & { requiredPermission?: Permission }>,
    defaultPermission?: Permission
  ): T[] {
}
    return resources.filter((resource: any) => {
}
      const permission = resource.requiredPermission || defaultPermission;
      return !permission || this.hasPermission(user, permission);
    });
  }

  /**
   * Create role guard for components
   */
  createRoleGuard(requiredRole: UserRole) {
}
    return (user: UserWithRoles | null): boolean => {
}
      return this.hasMinimumRole(user, requiredRole);
    };
  }

  /**
   * Create permission guard for components
   */
  createPermissionGuard(requiredPermissions: Permission | Permission[]) {
}
    return (user: UserWithRoles | null): boolean => {
}
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];
      return this.hasAllPermissions(user, permissions);
    };
  }
}

export const rbacService = new RBACService();
export default rbacService;

// Utility types for components
export type PermissionGuard = (user: UserWithRoles | null) => boolean;
export type RoleGuard = (user: UserWithRoles | null) => boolean;
