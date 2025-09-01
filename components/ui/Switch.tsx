
interface SwitchProps {
}
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
}

export const Switch: React.FC<SwitchProps> = ({
}
  checked,
  onChange,
  label,
  disabled = false,
  size = &apos;md&apos;
}: any) => {
}
  const sizeClasses = {
}
    sm: { track: &apos;w-8 h-4&apos;, thumb: &apos;w-3 h-3&apos; },
    md: { track: &apos;w-10 h-5&apos;, thumb: &apos;w-4 h-4&apos; },
    lg: { track: &apos;w-12 h-6&apos;, thumb: &apos;w-5 h-5&apos; }
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
}
          inline-block relative rounded-full transition-colors duration-200
          ${checked ? &apos;bg-blue-500&apos; : &apos;bg-gray-300&apos;}
          ${disabled ? &apos;opacity-50 cursor-not-allowed&apos; : &apos;cursor-pointer&apos;}
          ${track}
        `}
      >
        <span
          className={`
}
            inline-block rounded-full bg-white transition-transform duration-200
            ${checked ? &apos;translate-x-full&apos; : &apos;translate-x-0&apos;}
            ${thumb}
          `}
        />
      </button>
      
      {label && (
}
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </span>
      )}
    </div>
  );
};