

interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;}

export const NewspaperIcon: React.FC<{ className?: string }> = ({ className }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "h-5 w-5"} role="img" aria-label="Newspaper icon">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4" />
        <path d="M12 8h4" />
        <path d="M12 12h4" />
        <path d="M12 16h4" />
        <path d="M8 8v8" />
    </svg>
);