import { useState, useEffect } from &apos;react&apos;;

export const useMobile = () => {
}
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState(&apos;desktop&apos;);
  
  useEffect(() => {
}
    const checkScreenSize = () => {
}
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      if (width < 640) setScreenSize(&apos;mobile&apos;);
      else if (width < 1024) setScreenSize(&apos;tablet&apos;);
      else setScreenSize(&apos;desktop&apos;);
    };
    
    checkScreenSize();
    window.addEventListener(&apos;resize&apos;, checkScreenSize);
    
    return () => window.removeEventListener(&apos;resize&apos;, checkScreenSize);
  }, []);
  
  const addTouchSupport = (element: HTMLElement) => {
}
    element.style.touchAction = &apos;manipulation&apos;;
    element.style.webkitTapHighlightColor = &apos;transparent&apos;;
  };
  
  return {
}
    isMobile,
    isTablet,
    screenSize,
//     addTouchSupport
  };
};
