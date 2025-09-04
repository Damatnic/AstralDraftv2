import React from 'react';
import { LazyImage } from './LazyImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const generateSrcSet = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop();
    const base = baseSrc.replace(`.${ext}`, '');
    
    return [
      `${base}-400w.webp 400w`,
      `${base}-800w.webp 800w`,
      `${base}-1200w.webp 1200w`,
      `${base}-400w.${ext} 400w`,
      `${base}-800w.${ext} 800w`,
      `${base}-1200w.${ext} 1200w`
    ].join(', ');
  };

  return (
    <picture data-testid="optimizedimage">
      <source
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        type="image/webp"
      />
      <LazyImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedImage;