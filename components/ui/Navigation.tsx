/**
 * Standardized navigation components for consistent UX across views
 */

import React, { useCallback, useMemo } from &apos;react&apos;;
import { 
}
  createNavigationHandler, 
  createBackHandler, 
  NAVIGATION_BUTTON_STYLES,
//   generateBreadcrumbs
} from &apos;../../utils/navigationUtils&apos;;

interface NavigationButtonProps {
}
  variant?: keyof typeof NAVIGATION_BUTTON_STYLES;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;

}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
}
  variant = &apos;secondary&apos;,
  onClick,
  children,
  disabled = false,
  className = &apos;&apos;
}: any) => {
}
  const baseStyle = NAVIGATION_BUTTON_STYLES[variant];
  const disabledStyle = disabled ? &apos;opacity-50 cursor-not-allowed&apos; : &apos;cursor-pointer&apos;;
  const combinedClassName = `${baseStyle} ${disabledStyle} ${className}`.trim();

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={combinedClassName}
     aria-label="Action button">
      {children}
    </button>
  );
};

interface BackButtonProps {
}
  dispatch: React.Dispatch<any>;
  currentRoute: string;
  customBackRoute?: string;
  label?: string;
  className?: string;

}

export const BackButton: React.FC<BackButtonProps> = ({
}
  dispatch,
  currentRoute,
  customBackRoute,
  label = &apos;Back&apos;,
  className = &apos;&apos;
}: any) => {
}
  const handleBack = createBackHandler(dispatch, currentRoute, customBackRoute);
  
  return (
    <NavigationButton>
      variant="back"
      onClick={handleBack}
      className={className}
    >
      ← {label}
    </NavigationButton>
  );
};

interface QuickNavigationProps {
}
  dispatch: React.Dispatch<any>;
  currentRoute: string;
  showCommonRoutes?: boolean;
  customRoutes?: Array<{ label: string; route: string; variant?: keyof typeof NAVIGATION_BUTTON_STYLES }>;

export const QuickNavigation: React.FC<QuickNavigationProps> = ({
}
  dispatch,
  currentRoute,
  showCommonRoutes = true,
  customRoutes = []
}: any) => {
}
  const commonRoutes = showCommonRoutes ? [
    { label: &apos;Dashboard&apos;, route: &apos;DASHBOARD&apos;, variant: &apos;secondary&apos; as const },
    { label: &apos;League Hub&apos;, route: &apos;LEAGUE_HUB&apos;, variant: &apos;secondary&apos; as const },
    { label: &apos;My Team&apos;, route: &apos;TEAM_HUB&apos;, variant: &apos;secondary&apos; as const },
  ] : [];

  const allRoutes = [...commonRoutes, ...customRoutes];

  return (
    <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
      {allRoutes.map(({ label, route, variant = &apos;secondary&apos; }: any) => (
        <NavigationButton>
          key={route}
          variant={variant}
          onClick={createNavigationHandler(dispatch, route)}
          disabled={currentRoute === route}
        >
          {label}
        </NavigationButton>
      ))}
    </div>
  );
};

interface BreadcrumbNavigationProps {
}
  currentRoute: string;
  dispatch: React.Dispatch<any>;
  leagueName?: string;
  teamName?: string;
  className?: string;

}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
}
  currentRoute,
  dispatch,
  leagueName,
  teamName,
  className = &apos;&apos;
}: any) => {
}
  const breadcrumbs = generateBreadcrumbs(currentRoute, leagueName, teamName);

  if (breadcrumbs.length <= 1) {
}
    return null; // Don&apos;t show breadcrumbs for single-level navigation

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {breadcrumbs.map((breadcrumb, index) => (
}
        <React.Fragment key={breadcrumb.route}>
          {index > 0 && (
}
            <span className="text-gray-400 mx-2 sm:px-4 md:px-6 lg:px-8">/</span>
          )}
          {breadcrumb.isActive ? (
}
            <span className="text-[var(--text-primary)] font-medium sm:px-4 md:px-6 lg:px-8">
              {breadcrumb.label}
            </span>
          ) : (
            <button
              onClick={createNavigationHandler(dispatch, breadcrumb.route)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              {breadcrumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface ViewHeaderProps {
}
  title: string;
  subtitle?: string;
  dispatch: React.Dispatch<any>;
  currentRoute: string;
  showBackButton?: boolean;
  customBackRoute?: string;
  showBreadcrumbs?: boolean;
  leagueName?: string;
  teamName?: string;
  actions?: React.ReactNode;
  className?: string;

}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
}
  title,
  subtitle,
  dispatch,
  currentRoute,
  showBackButton = true,
  customBackRoute,
  showBreadcrumbs = false,
  leagueName,
  teamName,
  actions,
  className = &apos;&apos;
}: any) => {
}
  return (
    <header className={`flex-shrink-0 mb-6 ${className}`}>
      {showBreadcrumbs && (
}
        <BreadcrumbNavigation>
          currentRoute={currentRoute}
          dispatch={dispatch}
          leagueName={leagueName}
          teamName={teamName}
          className="mb-4 sm:px-4 md:px-6 lg:px-8"
        />
      )}
      
      <div className="flex justify-between items-start sm:px-4 md:px-6 lg:px-8">
        <div className="flex-grow sm:px-4 md:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
            {title}
          </h1>
          {subtitle && (
}
            <p className="text-sm text-[var(--text-secondary)] tracking-widest mt-2 sm:px-4 md:px-6 lg:px-8">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4 ml-4 sm:px-4 md:px-6 lg:px-8">
          {actions}
          {showBackButton && (
}
            <BackButton>
              dispatch={dispatch}
              currentRoute={currentRoute}
              customBackRoute={customBackRoute}
            />
          )}
        </div>
      </div>
    </header>
  );
};
