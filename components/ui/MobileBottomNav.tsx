import React, { useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;

interface NavItem {
}
  id: string;
  label: string;
  icon: string;
  view: string;

}

interface MobileBottomNavProps {
}
  activeView: string;
  onViewChange: (view: string) => void;
  notificationCount?: number;}

const navItems: NavItem[] = [
  { id: &apos;dashboard&apos;, label: &apos;Home&apos;, icon: &apos;🏠&apos;, view: &apos;DASHBOARD&apos; },
  { id: &apos;team&apos;, label: &apos;Team&apos;, icon: &apos;🏈&apos;, view: &apos;TEAM_HUB&apos; },
  { id: &apos;players&apos;, label: &apos;Players&apos;, icon: &apos;👥&apos;, view: &apos;PLAYERS&apos; },
  { id: &apos;league&apos;, label: &apos;League&apos;, icon: &apos;🏆&apos;, view: &apos;LEAGUE_HUB&apos; },
  { id: &apos;more&apos;, label: &apos;More&apos;, icon: &apos;⋯&apos;, view: &apos;PROFILE&apos; }
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
}
  activeView,
  onViewChange,
  notificationCount = 0
}: any) => {
}
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-pane border-t border-white/20 rounded-t-xl sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom sm:px-4 md:px-6 lg:px-8">
        {navItems.map((item: any) => {
}
          const isActive = activeView === item.view;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.view)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg min-h-[44px] min-w-[44px] transition-colors ${
}
                isActive ? &apos;text-[var(--color-primary)]&apos; : &apos;text-[var(--text-secondary)]&apos;
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={item.label}
            >
              <span className="text-xl mb-1 sm:px-4 md:px-6 lg:px-8">{item.icon}</span>
              <span className="text-xs font-medium sm:px-4 md:px-6 lg:px-8">{item.label}</span>
              
              {item.id === &apos;team&apos; && notificationCount > 0 && (
}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                  <span className="text-xs text-white font-bold sm:px-4 md:px-6 lg:px-8">
                    {notificationCount > 9 ? &apos;9+&apos; : notificationCount}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};