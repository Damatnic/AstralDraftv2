
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md'
}: any) => {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3' },
    md: { track: 'w-10 h-5', thumb: 'w-4 h-4' },
    lg: { track: 'w-12 h-6', thumb: 'w-5 h-5' }
  };

  const { track, thumb } = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          inline-block relative rounded-full transition-colors duration-200
          ${checked ? 'bg-blue-500' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${track}
        `}
      >
        <span
          className={`
            inline-block rounded-full bg-white transition-transform duration-200
            ${checked ? 'translate-x-full' : 'translate-x-0'}
            ${thumb}
          `}
        />
      </button>
      
      {label && (
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </span>
      )}
    </div>
  );
};