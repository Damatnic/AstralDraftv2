
import React from 'react';

interface SidebarProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  width?: string | number;
  position?: 'left' | 'right';
  overlay?: boolean;
  className?: string;
}

/**
 * Basic Sidebar component for application layout
 * Can be extended with additional functionality as needed
 */
const Sidebar: React.FC<SidebarProps> = ({
  children,
  isOpen = true,
  onToggle,
  width = '250px',
  position = 'left',
  overlay = false,
  className = ''
}: any) => {
  const sidebarStyles = {
    width: typeof width === 'number' ? `${width}px` : width,
    [position]: isOpen ? '0' : '-100%',
    transition: 'all 0.3s ease-in-out'
  };

  const baseClasses = `
    fixed top-0 h-full bg-white border-r border-gray-200 shadow-lg z-40
    ${overlay ? 'absolute' : 'relative'}
    ${position === 'right' ? 'right-0 border-l border-r-0' : 'left-0'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      {overlay && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
      <aside
        className={baseClasses}
        style={sidebarStyles}
      >
        {children && (
          <div className="p-4 h-full overflow-y-auto">
            {children}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;