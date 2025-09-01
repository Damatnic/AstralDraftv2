
import { LazyImage } from &apos;./LazyImage&apos;;

interface AvatarProps {
}
  avatar: string;
  className?: string;
  alt?: string;
  generatedAvatarUrl?: string;

}

export const Avatar: React.FC<AvatarProps> = ({ avatar, className, alt = &apos;Team avatar&apos;, generatedAvatarUrl }: any) => {
}
  const isImageUrl = generatedAvatarUrl || (avatar && (avatar.startsWith(&apos;data:image&apos;) || avatar.startsWith(&apos;https&apos;)));

  if (isImageUrl) {
}
    return (
      <LazyImage>
        src={generatedAvatarUrl || avatar}
        alt={alt}
        className={`object-cover bg-black/20 ${className}`}
        fallback="https://api.dicebear.com/7.x/avataaars/svg?seed=default"
        loading="lazy"
      />
    );
  }

  // It&apos;s an emoji
  return (
      <span className={`flex items-center justify-center bg-black/10 ${className}`}>
          {avatar}
      </span>
  );
};

export default Avatar;
