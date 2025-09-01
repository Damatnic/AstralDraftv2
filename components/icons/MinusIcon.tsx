
interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  'aria-label'?: string;


export const MinusIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="minus icon">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);