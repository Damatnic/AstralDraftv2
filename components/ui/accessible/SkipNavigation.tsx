/**
 * SkipNavigation Component
 * WCAG 2.1 Level AA Compliant Skip Navigation Links
 */


interface SkipLink {
}
  id: string;
  label: string;
}

interface SkipNavigationProps {
}
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { id: &apos;main-content&apos;, label: &apos;Skip to main content&apos; },
  { id: &apos;navigation&apos;, label: &apos;Skip to navigation&apos; },
  { id: &apos;footer&apos;, label: &apos;Skip to footer&apos; }
];

const SkipNavigation: React.FC<SkipNavigationProps> = ({ 
}
  links = defaultLinks 
}: any) => {
}
  return (
    <div className="skip-navigation">
      {links.map((link: any) => (
}
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:no-underline focus:rounded-br-lg"
          onClick={(e: any) => {
}
            e.preventDefault();
            const target = document.getElementById(link.id);
            if (target) {
}
              target.scrollIntoView({ behavior: &apos;smooth&apos; });
              target.focus({ preventScroll: true });
              
              // Announce navigation
              const announcement = document.createElement(&apos;div&apos;);
              announcement.setAttribute(&apos;role&apos;, &apos;status&apos;);
              announcement.setAttribute(&apos;aria-live&apos;, &apos;polite&apos;);
              announcement.className = &apos;sr-only&apos;;
              announcement.textContent = `Navigated to ${link.label.replace(&apos;Skip to &apos;, &apos;&apos;)}`;
              document.body.appendChild(announcement);
              setTimeout(() => document.body.removeChild(announcement), 1000);
            }
          }}
        >
          {link.label}
        </a>
      ))}
      
      <style jsx>{`
}
        .skip-link:focus {
}
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