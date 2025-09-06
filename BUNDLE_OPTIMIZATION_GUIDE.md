# 📦 Bundle Size Optimization Guide
## Reduce from 2.5MB to <500KB

## Current Status
- **Main Bundle**: 2,599.75 kB (442.30 kB gzipped) ❌
- **Target Bundle**: <500 kB (<100 kB gzipped) ✅

## Immediate Optimizations

### 1. Vite Configuration Optimization
Update `vite.config.ts` with better chunking:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-charts': ['recharts', 'chart.js'],
          
          // Feature chunks
          'draft-room': ['./src/views/EnhancedDraftRoomView'],
          'analytics': ['./src/components/analytics/*'],
          'admin': ['./src/components/admin/*'],
        }
      }
    },
    // Enable chunk splitting
    chunkSizeWarningLimit: 100, // Warn at 100kb instead of 500kb
  }
});
```

### 2. Component Lazy Loading Enhancement
Add more granular lazy loading in `App.tsx`:

```typescript
// Heavy components - load only when needed
const PlayerDetailModal = React.lazy(() => 
  import('./components/players/PlayerDetailModal')
);
const AdvancedAnalytics = React.lazy(() => 
  import('./components/analytics/AdvancedAnalytics')
);
const AdminDashboard = React.lazy(() => 
  import('./components/admin/AdminDashboard')
);
```

### 3. Dynamic Imports for Heavy Libraries
Replace static imports with dynamic loading:

```typescript
// Instead of: import { Chart } from 'chart.js';
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

// Instead of: import DOMPurify from 'isomorphic-dompurify';
const sanitizeHTML = async (html: string) => {
  const DOMPurify = await import('isomorphic-dompurify');
  return DOMPurify.default.sanitize(html);
};
```

### 4. Tree Shaking Optimization
Update imports to use specific exports:

```typescript
// Instead of: import * as lodash from 'lodash';
import { debounce, throttle } from 'lodash';

// Instead of: import { motion } from 'framer-motion';
import { motion } from 'framer-motion/dist/framer-motion';
```

## Commands to Run

1. **Analyze current bundle:**
   ```bash
   npm run build:analyze
   npx webpack-bundle-analyzer dist
   ```

2. **Optimize build:**
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   npm run build
   npx rollup-plugin-visualizer dist/stats.html --open
   ```

3. **Test performance:**
   ```bash
   npm run preview
   # Check loading time in browser dev tools
   ```

## Expected Results
- **Bundle Size**: 2.5MB → <500KB (80% reduction)
- **Load Time**: >5s → <2s  
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s

## Priority Order
1. Manual chunk splitting (biggest impact)
2. Dynamic imports for heavy libraries
3. Component lazy loading enhancement
4. Tree shaking optimization