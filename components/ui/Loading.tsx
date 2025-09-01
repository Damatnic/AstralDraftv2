
interface LoadingProps {
}
  size?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  text?: string;
  variant?: &apos;spinner&apos; | &apos;skeleton&apos;;

}

export const Loading: React.FC<LoadingProps> = ({
}
  size = &apos;md&apos;,
  text,
  variant = &apos;spinner&apos;
}: any) => {
}
  const sizeClasses = {
}
    sm: &apos;w-4 h-4&apos;,
    md: &apos;w-8 h-8&apos;, 
    lg: &apos;w-12 h-12&apos;
  };

  if (variant === &apos;skeleton&apos;) {
}
    return (
      <div className="animate-pulse sm:px-4 md:px-6 lg:px-8">
        <div className="glass-pane p-6 space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="h-4 bg-white/20 rounded w-3/4 sm:px-4 md:px-6 lg:px-8"></div>
          <div className="h-4 bg-white/20 rounded w-1/2 sm:px-4 md:px-6 lg:px-8"></div>
          <div className="h-4 bg-white/20 rounded w-5/6 sm:px-4 md:px-6 lg:px-8"></div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 sm:px-4 md:px-6 lg:px-8">
      <div className={`${sizeClasses[size]} border-2 border-white/30 border-t-white rounded-full animate-spin`} />
      {text && <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{text}</p>}
    </div>
  );
};