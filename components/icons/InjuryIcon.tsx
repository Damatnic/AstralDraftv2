
interface IconProps {
}
  size?: number | string;
  className?: string;
  color?: string;
  &apos;aria-label&apos;?: string;

}

export const InjuryIcon: React.FC<{ className?: string }> = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} role="img" aria-label="injury icon">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/>
        <path d="M12 8v4"/>
        <path d="M12 16h.01"/>
        <path d="m8 12h8"/>
    </svg>
);