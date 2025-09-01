import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// EMERGENCY PERFORMANCE CONFIGURATION
// This config achieves maximum bundle size reduction through aggressive splitting

export default defineConfig(({ mode }: { mode: string }) => {
    const isProduction = mode === 'production';
    
    return {
      base: '/',
      plugins: [
        react({
          jsxRuntime: 'classic',
          jsxImportSource: undefined,
          babel: {
            plugins: [],
            presets: []
          }
        }),
      ],
      define: {
        'global': 'globalThis',
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          // Replace heavy libraries with lighter alternatives
          'lodash': 'lodash-es',
          'moment': 'dayjs',
          'crypto': 'crypto-browserify',
          'stream': 'stream-browserify',
          'util': 'util',
          'events': 'events',
          'buffer': 'buffer'
        }
      },
      build: {
        target: 'es2020',
        minify: isProduction ? 'terser' : false,
        terserOptions: isProduction ? {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
            passes: 3,
            unsafe: true,
            unsafe_arrows: true,
            unsafe_comps: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true,
            unused: true,
            dead_code: true,
            collapse_vars: true,
            reduce_vars: true,
            keep_fargs: false,
            toplevel: true,
            hoist_funs: true,
            hoist_vars: true,
            inline: 3,
            loops: true,
            if_return: true,
            join_vars: true,
            ecma: 2020,
          },
          mangle: {
            safari10: true,
            toplevel: true,
            properties: {
              regex: /^_/,
            }
          },
          format: {
            comments: false,
            ecma: 2020,
          },
          module: true,
          toplevel: true,
        } : undefined,
        sourcemap: false,
        cssMinify: isProduction ? 'esbuild' : false,
        assetsInlineLimit: 8192, // Inline smaller assets
        rollupOptions: {
          output: {
            // Aggressive manual chunking strategy
            manualChunks: (id: any) => {
              // Core React (essential)
              if (id.includes('react') || id.includes('react-dom')) {
                if (id.includes('react-dom')) return 'react-dom';
                return 'react-core';
              }
              
              // Heavy animation library
              if (id.includes('framer-motion')) {
                return 'animation';
              }
              
              // Chart libraries (lazy loaded)
              if (id.includes('chart.js') || id.includes('recharts')) {
                return 'charts';
              }
              
              // Icons (lazy loaded)
              if (id.includes('lucide-react') || id.includes('react-icons')) {
                return 'icons';
              }
              
              // Payment (lazy loaded)
              if (id.includes('stripe')) {
                return 'payment';
              }
              
              // DnD (lazy loaded)
              if (id.includes('@dnd-kit')) {
                return 'dnd';
              }
              
              // Socket/WebSocket (lazy loaded)
              if (id.includes('socket.io')) {
                return 'realtime';
              }
              
              // Utilities
              if (id.includes('lodash') || id.includes('axios')) {
                return 'utils';
              }
              
              // All other vendor code
              if (id.includes('node_modules')) {
                // Group smaller libraries together
                const module = id.split('node_modules/')[1];
                const packageName = module.split('/')[0];
                
                // Group small packages together
                const smallPackages = [
                  'tslib', 'classnames', 'clsx', 'tiny-invariant',
                  'warning', 'object-assign', 'prop-types'
                ];
                
                if (smallPackages.some((pkg: any) => packageName.includes(pkg))) {
                  return 'vendor-small';
                }
                
                return 'vendor';
              }
              
              // Feature-based splitting for app code
              if (id.includes('/components/draft/')) return 'draft';
              if (id.includes('/components/matchup/')) return 'matchup';
              if (id.includes('/components/player/')) return 'players';
              if (id.includes('/components/trade/')) return 'trade';
              if (id.includes('/components/waiver/')) return 'waiver';
              if (id.includes('/components/research/')) return 'research';
              if (id.includes('/components/admin/')) return 'admin';
              if (id.includes('/components/auth/')) return 'auth';
              if (id.includes('/components/settings/')) return 'settings';
              if (id.includes('/services/')) return 'services';
              if (id.includes('/hooks/')) return 'hooks';
              if (id.includes('/utils/')) return 'utilities';
              if (id.includes('/contexts/')) return 'contexts';
            },
            
            // Optimize chunk names
            entryFileNames: isProduction ? '[name].[hash:8].js' : '[name].js',
            chunkFileNames: (chunkInfo: any) => {
              const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId : '';
              
              // Critical chunks get shorter hashes
              if (chunkInfo.name === 'react-core' || chunkInfo.name === 'react-dom') {
                return isProduction ? '[name].[hash:6].js' : '[name].js';
              }
              
              // Feature chunks
              if (chunkInfo.name?.startsWith('feature-') || 
                  chunkInfo.name?.includes('View')) {
                return isProduction ? 'features/[name].[hash:8].js' : 'features/[name].js';
              }
              
              // Vendor chunks
              if (chunkInfo.name?.startsWith('vendor') || 
                  chunkInfo.name === 'animation' ||
                  chunkInfo.name === 'charts' ||
                  chunkInfo.name === 'icons') {
                return isProduction ? 'vendor/[name].[hash:8].js' : 'vendor/[name].js';
              }
              
              // Default
              return isProduction ? 'chunks/[name].[hash:8].js' : 'chunks/[name].js';
            },
            
            // Optimize asset file names
            assetFileNames: (assetInfo: any) => {
              const info = assetInfo.name?.split('.');
              const ext = info?.[info.length - 1];
              
              // Images
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
                return 'img/[name].[hash:8][extname]';
              }
              
              // Fonts
              if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
                return 'fonts/[name].[hash:8][extname]';
              }
              
              // CSS
              if (ext === 'css') {
                return 'css/[name].[hash:8][extname]';
              }
              
              return 'assets/[name].[hash:8][extname]';
            },
            
            // Preserve module structure for better tree shaking
            preserveModules: false,
          },
          
          // Tree shaking optimizations
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
            correctVarValueBeforeDeclaration: true,
            preset: 'smallest',
            annotations: true,
            tryCatchDeoptimization: false,
          },
          
          // Perf improvements
          experimentalLogSideEffects: false,
        },
        
        // Other build optimizations
        emptyOutDir: true,
        chunkSizeWarningLimit: 200, // Very aggressive limit
        cssCodeSplit: true,
        reportCompressedSize: false,
        
        // Module preload polyfill
        modulePreload: {
          polyfill: true,
        },
        
        // Common JS optimization
        commonjsOptions: {
          transformMixedEsModules: true,
          requireReturnsDefault: 'auto',
        },
      },
      
      // Optimize dependencies
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-dom/client',
        ],
        exclude: [
          '@types/node',
          '@google/genai',
          // Exclude heavy dependencies that should be lazy loaded
          'chart.js',
          'recharts',
          'framer-motion',
          '@dnd-kit/core',
          '@dnd-kit/sortable',
          'socket.io-client',
        ],
        esbuildOptions: {
          target: 'es2020',
          supported: {
            bigint: true,
          },
        },
      },
      
      // Development optimizations
      server: {
        hmr: {
          overlay: false, // Disable error overlay in dev
        },
      },
      
      // ESBuild optimizations
      esbuild: {
        jsx: 'transform',
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        legalComments: 'none',
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
        treeShaking: true,
        minifyIdentifiers: isProduction,
        minifySyntax: isProduction,
        minifyWhitespace: isProduction,
      },
      
      // Additional performance hints
      logLevel: isProduction ? 'warn' : 'info',
    };
});