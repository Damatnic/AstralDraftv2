
interface ResponsiveGridProps {
}
  children: React.ReactNode;
  cols?: {
}
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;;
  className?: string;

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
}
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = &apos;md&apos;,
  className = &apos;&apos;
}) => {
}
  const gapClasses = {
}
    sm: &apos;gap-2&apos;,
    md: &apos;gap-4&apos;,
    lg: &apos;gap-6&apos;
  };

  const gridClasses = `
//     grid
    grid-cols-${cols.sm || 1}
    ${cols.md ? `md:grid-cols-${cols.md}` : &apos;&apos;}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : &apos;&apos;}
    ${cols.xl ? `xl:grid-cols-${cols.xl}` : &apos;&apos;}
    ${gapClasses[gap]}
    ${className}
  `.trim().replace(/\s+/g, &apos; &apos;);

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};