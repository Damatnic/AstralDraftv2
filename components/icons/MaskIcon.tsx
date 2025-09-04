
interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;
}

export const MaskIcon: React.FC<{ className?: string }> = ({ className }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="mask icon">
        <path d="M12 2a5 5 0 0 0-5 5v2"/>
        <path d="M12 2a5 5 0 0 1 5 5v2"/>
        <path d="M12 12h.01"/>
        <path d="M20 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8c.5 0 1 .1 1.5.2"/>
        <path d="M12 12a4 4 0 0 0-4-4"/>
        <path d="M12 12a4 4 0 0 1 4-4"/>
    </svg>
);