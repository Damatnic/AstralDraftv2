
interface BadgeProps {
}
  children: React.ReactNode;
  variant?: &apos;default&apos; | &apos;success&apos; | &apos;warning&apos; | &apos;error&apos; | &apos;info&apos; | &apos;secondary&apos; | &apos;destructive&apos;;
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  className?: string;

}

export const Badge: React.FC<BadgeProps> = ({
}
  children,
  variant = &apos;default&apos;,
  size = &apos;md&apos;,
  className = &apos;&apos;
}: any) => {
}
  const variantClasses = {
}
    default: &apos;bg-gray-500/20 text-gray-300 border-gray-500/30&apos;,
    success: &apos;bg-green-500/20 text-green-300 border-green-500/30&apos;,
    warning: &apos;bg-yellow-500/20 text-yellow-300 border-yellow-500/30&apos;,
    error: &apos;bg-red-500/20 text-red-300 border-red-500/30&apos;,
    info: &apos;bg-blue-500/20 text-blue-300 border-blue-500/30&apos;,
    secondary: &apos;bg-purple-500/20 text-purple-300 border-purple-500/30&apos;,
    destructive: &apos;bg-red-600/20 text-red-400 border-red-600/30&apos;
  };

  const sizeClasses = {
}
    sm: &apos;px-2 py-1 text-xs&apos;,
    md: &apos;px-3 py-1 text-sm&apos;,
    lg: &apos;px-4 py-2 text-base&apos;
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};