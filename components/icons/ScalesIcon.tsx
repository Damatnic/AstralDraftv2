
interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;
}

export const ScalesIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="scales icon">
        <path d="m16 16 3-8 3 8c-2 1-4 1-6 0"/>
        <path d="m2 16 3-8 3 8c-2 1-4 1-6 0"/>
        <path d="M7 21h10"/>
        <path d="M12 3v18"/>
        <path d="M3 7h18"/>
    </svg>
);