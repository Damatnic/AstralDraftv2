import { LazyImage } from &apos;./LazyImage&apos;;

interface OptimizedImageProps {
}
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;

}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
}
  src,
  alt,
  width,
  height,
  className = &apos;&apos;,
  sizes = &apos;(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw&apos;
}) => {
}
  const generateSrcSet = (baseSrc: string) => {
}
    const ext = baseSrc.split(&apos;.&apos;).pop();
    const base = baseSrc.replace(`.${ext}`, &apos;&apos;);
    
    return [
      `${base}-400w.webp 400w`,
      `${base}-800w.webp 800w`,
      `${base}-1200w.webp 1200w`,
      `${base}-400w.${ext} 400w`,
      `${base}-800w.${ext} 800w`,
      `${base}-1200w.${ext} 1200w`
    ].join(&apos;, &apos;);
  };

  return (
    <picture>
      <source
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        type="image/webp"
      />
      <LazyImage>
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