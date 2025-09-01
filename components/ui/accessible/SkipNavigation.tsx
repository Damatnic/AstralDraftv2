/**
 * SkipNavigation Component
 * WCAG 2.1 Level AA Compliant Skip Navigation Links
 */

import React from 'react';

interface SkipLink {
  id: string;
  label: string;
}

interface SkipNavigationProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { id: 'main-content', label: 'Skip to main content' },
  { id: 'navigation', label: 'Skip to navigation' },
  { id: 'footer', label: 'Skip to footer' }
];

const SkipNavigation: React.FC<SkipNavigationProps> = ({ 
  links = defaultLinks 
}: any) => {
  return (
    <div className="skip-navigation">
      {links.map((link: any) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:no-underline focus:rounded-br-lg"
          onClick={(e: any) => {
            e.preventDefault();
            const target = document.getElementById(link.id);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              target.focus({ preventScroll: true });
              
              // Announce navigation
              const announcement = document.createElement('div');
              announcement.setAttribute('role', 'status');
              announcement.setAttribute('aria-live', 'polite');
              announcement.className = 'sr-only';
              announcement.textContent = `Navigated to ${link.label.replace('Skip to ', '')}`;
              document.body.appendChild(announcement);
              setTimeout(() => document.body.removeChild(announcement), 1000);
            }
          }}
        >
          {link.label}
        </a>
      ))}
      
      <style jsx>{`
        .skip-link:focus {
          clip: auto !important;
          clip-path: none !important;
          height: auto !important;
          margin: 0 !important;
          overflow: visible !important;
          padding: 0.5rem 1rem !important;
          position: absolute !important;
          width: auto !important;
          white-space: nowrap !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
};

export default SkipNavigation;