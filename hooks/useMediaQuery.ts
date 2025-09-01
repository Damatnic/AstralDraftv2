import { useState, useEffect } from &apos;react&apos;;

export function useMediaQuery(query: string): boolean {
}
  const [matches, setMatches] = useState(false);

  useEffect(() => {
}
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
}
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    
    if (typeof media.addEventListener === &apos;function&apos;) {
}
      media.addEventListener(&apos;change&apos;, listener);
    } else {
}
      // Fallback for older browsers
      media.addListener(listener);
    }
    
    return () => {
}
      if (typeof media.removeEventListener === &apos;function&apos;) {
}
        media.removeEventListener(&apos;change&apos;, listener);
      } else {
}
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
}