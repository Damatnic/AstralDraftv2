import { enhancedCacheService } from &apos;../services/enhancedCacheService&apos;;

export const useCache = () => {
}
  return {
}
    set: (key: string, data: any, ttl?: number) => enhancedCacheService.set(key, data, ttl),
    get: (key: string) => enhancedCacheService.get(key),
    invalidate: (key: string) => enhancedCacheService.invalidate(key),
    clear: () => enhancedCacheService.clearAll()
  };
};

export default useCache;