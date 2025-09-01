/**
 * Mobile Navigation Component
 * Responsive bottom navigation bar with safe area support
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { 
}
  Home, 
  Target, 
  BarChart3, 
  Settings, 
  User, 
  Trophy,
  Calendar,
  Bell,
  Menu,
//   X
} from &apos;lucide-react&apos;;

interface NavigationItem {
}
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
}

interface Props {
}
  activeView: string;
  onViewChange: (view: string) => void;
  notificationCount?: number;
  className?: string;
}

const primaryNavItems: NavigationItem[] = [
  { id: &apos;home&apos;, label: &apos;Home&apos;, icon: Home, path: &apos;/&apos; },
  { id: &apos;predictions&apos;, label: &apos;Oracle&apos;, icon: Target, path: &apos;/oracle&apos; },
  { id: &apos;analytics&apos;, label: &apos;Analytics&apos;, icon: BarChart3, path: &apos;/analytics&apos; },
  { id: &apos;profile&apos;, label: &apos;Profile&apos;, icon: User, path: &apos;/profile&apos; },
];

const secondaryNavItems: NavigationItem[] = [
  { id: &apos;contests&apos;, label: &apos;Contests&apos;, icon: Trophy, path: &apos;/contests&apos; },
  { id: &apos;schedule&apos;, label: &apos;Schedule&apos;, icon: Calendar, path: &apos;/schedule&apos; },
  { id: &apos;notifications&apos;, label: &apos;Notifications&apos;, icon: Bell, path: &apos;/notifications&apos; },
  { id: &apos;settings&apos;, label: &apos;Settings&apos;, icon: Settings, path: &apos;/settings&apos; },
];

const MobileNavigation: React.FC<Props> = ({ 
}
  activeView, 
  onViewChange, 
  notificationCount = 0,
  className = &apos;&apos;
}: any) => {
}
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
}
    const checkDevice = () => {
}
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    
    checkDevice();
    window.addEventListener(&apos;resize&apos;, checkDevice);
    return () => window.removeEventListener(&apos;resize&apos;, checkDevice);
    }
  }, []);

  const handleNavItemClick = (item: NavigationItem) => {
}
    onViewChange(item.id);
    setShowSecondaryNav(false);
  };

  const renderNavItem = (item: NavigationItem, isSecondary = false) => {
}
    const isActive = activeView === item.id;
    const IconComponent = item.icon;
    const showBadge = item.id === &apos;notifications&apos; && notificationCount > 0;

    return (
      <motion.button
        key={item.id}
        onClick={() => handleNavItemClick(item)}
        className={`
}
          relative flex flex-col items-center justify-center
          min-h-[44px] min-w-[44px] px-2 py-1
          rounded-lg transition-colors duration-200
          ${isActive 
}
            ? &apos;text-blue-400 bg-blue-400/10&apos; 
            : &apos;text-gray-400 hover:text-white hover:bg-white/5&apos;
          }
          ${isSecondary ? &apos;w-full text-left flex-row px-4 py-3&apos; : &apos;&apos;}
        `}
        whileTap={{ scale: 0.95 }}
        initial={false}
        animate={{
}
          backgroundColor: isActive ? &apos;rgba(59, 130, 246, 0.1)&apos; : &apos;transparent&apos;
        }}
      >
        <div className="relative">
          <IconComponent className={`w-5 h-5 ${isSecondary ? &apos;mr-3&apos; : &apos;mb-0.5&apos;}`} />
          {showBadge && (
}
            <motion.div
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {notificationCount > 99 ? &apos;99+&apos; : notificationCount}
            </motion.div>
          )}
        </div>
        <span className={`text-xs font-medium ${isSecondary ? &apos;flex-1&apos; : &apos;&apos;}`}>
          {item.label}
        </span>
      </motion.button>
    );
  };

  return (
    <>
      {/* Main Bottom Navigation */}
      <motion.nav
        className={`
}
          fixed bottom-0 left-0 right-0 z-50
          bg-gray-800/95 backdrop-blur-sm
          border-t border-gray-700
          ${className}
        `}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        style={{ 
}
          paddingBottom: &apos;env(safe-area-inset-bottom)&apos;,
          paddingLeft: &apos;env(safe-area-inset-left)&apos;,
          paddingRight: &apos;env(safe-area-inset-right)&apos;
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {primaryNavItems.map((item: any) => renderNavItem(item))}
          
          {/* More Menu Button */}
          <motion.button
            onClick={() => setShowSecondaryNav(!showSecondaryNav)}
            className={`
}
              flex flex-col items-center justify-center
              min-h-[44px] min-w-[44px] px-2 py-1
              rounded-lg transition-colors duration-200
              ${showSecondaryNav 
}
                ? &apos;text-blue-400 bg-blue-400/10&apos; 
                : &apos;text-gray-400 hover:text-white hover:bg-white/5&apos;
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-medium">More</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Secondary Navigation Overlay */}
      <AnimatePresence>
        {showSecondaryNav && (
}
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecondaryNav(false)}
            />

            {/* Secondary Nav Panel */}
            <motion.div
              className="
                fixed bottom-0 left-0 right-0 z-50
                bg-gray-800/98 backdrop-blur-sm
                border-t border-gray-700
                rounded-t-xl
              "
              style={{ 
}
                paddingBottom: &apos;calc(72px + env(safe-area-inset-bottom))&apos;,
                paddingLeft: &apos;env(safe-area-inset-left)&apos;,
                paddingRight: &apos;env(safe-area-inset-right)&apos;
              }}
              initial={{ y: &apos;100%&apos; }}
              animate={{ y: 0 }}
              exit={{ y: &apos;100%&apos; }}
              transition={{ type: &apos;spring&apos;, damping: 25, stiffness: 200 }}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">More Options</h3>
                <button
                  onClick={() => setShowSecondaryNav(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Secondary Nav Items */}
              <div className="p-4 space-y-2">
                {secondaryNavItems.map((item: any) => renderNavItem(item, true))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tablet-specific horizontal navigation */}
      {isTablet && (
}
        <motion.nav
          className="
            fixed top-0 left-0 right-0 z-40
            bg-gray-800/95 backdrop-blur-sm
            border-b border-gray-700
          "
          style={{ 
}
            paddingTop: &apos;env(safe-area-inset-top)&apos;,
            paddingLeft: &apos;env(safe-area-inset-left)&apos;,
            paddingRight: &apos;env(safe-area-inset-right)&apos;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-6">
              {[...primaryNavItems, ...secondaryNavItems].map((item: any) => (
}
                <motion.button
                  key={`tablet-${item.id}`}
                  onClick={() => handleNavItemClick(item)}
                  className={`
}
                    flex items-center space-x-2 px-3 py-2 rounded-lg
                    min-h-[44px] transition-colors duration-200
                    ${activeView === item.id 
}
                      ? &apos;text-blue-400 bg-blue-400/10&apos; 
                      : &apos;text-gray-400 hover:text-white hover:bg-white/5&apos;
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.id === &apos;notifications&apos; && notificationCount > 0 && (
}
                    <div className="bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {notificationCount > 99 ? &apos;99+&apos; : notificationCount}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </>
  );
};

const MobileNavigationWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobileNavigation {...props} />
  </ErrorBoundary>
);

export default React.memo(MobileNavigationWithErrorBoundary);
