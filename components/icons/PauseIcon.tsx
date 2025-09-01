
interface IconProps {
}
  size?: number | string;
  className?: string;
  color?: string;
  &apos;aria-label&apos;?: string;

}

export const PauseIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="pause icon">
        <rect x="6" y="4" width="24" height="24" />
        <rect x="14" y="4" width="24" height="24" />
    </svg>
);