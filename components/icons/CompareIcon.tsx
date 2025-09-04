
interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;
}

export const CompareIcon: React.FC<{ className?: string }> = ({ className }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="compare icon">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
    </svg>
);