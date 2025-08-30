import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }: { mode: string }) => {
    const isProduction = mode === 'production';
    
    return {
      base: './',
      plugins: [
        react({
          // Use classic JSX runtime to avoid jsxDEV issues
          jsxRuntime: 'classic',
          jsxImportSource: undefined,
          babel: {
            plugins: [],
            presets: []
          }
        })
      ],
      define: {
        'global': 'globalThis',
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          'crypto': 'crypto-browserify',
          'stream': 'stream-browserify',
          'util': 'util',
          'events': 'events',
          'buffer': 'buffer'
        }
      },
      build: {
        target: 'es2020',
        minify: isProduction ? ('esbuild' as const) : false,
        sourcemap: isProduction ? false : true,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Create more granular chunks for better optimization
              if (id.includes('node_modules')) {
                // Framework core
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-vendor';
                }
                // UI and animation libraries
                if (id.includes('framer-motion')) {
                  return 'motion-vendor';
                }
                // AI features - separate chunk for conditional loading
                if (id.includes('@google/genai')) {
                  return 'ai-vendor';
                }
                // Charts - only loaded when needed
                if (id.includes('recharts') || id.includes('chart.js') || id.includes('react-chartjs-2')) {
                  return 'charts-vendor';
                }
                // Icons - optimize icon imports
                if (id.includes('lucide-react') || id.includes('react-icons')) {
                  return 'icons-vendor';
                }
                // Utility libraries
                if (id.includes('lodash') || id.includes('axios')) {
                  return 'utils-vendor';
                }
                // Other vendor libraries
                return 'vendor';
              }
              
              // Split large application components
              if (id.includes('views/Enhanced')) {
                // Large enhanced views get their own chunks
                if (id.includes('EnhancedTeamHubView')) {
                  return 'team-hub-chunk';
                }
                if (id.includes('EnhancedDraftRoomView')) {
                  return 'draft-room-chunk';
                }
                if (id.includes('EnhancedDraftPrepView')) {
                  return 'draft-prep-chunk';
                }
                if (id.includes('EnhancedCommissionerToolsView')) {
                  return 'admin-tools-chunk';
                }
                return 'enhanced-views-chunk';
              }
              
              // Player-related components
              if (id.includes('components/player') || id.includes('PlayerDetailModal')) {
                return 'player-components-chunk';
              }
              
              // Draft-related services and components
              if (id.includes('services/realTimeDraftService') || id.includes('services/advancedAiDraftCoach')) {
                return 'draft-services-chunk';
              }
              
              // AI and analytics services
              if (id.includes('services/geminiService') || id.includes('services/aiAnalytics')) {
                return 'ai-services-chunk';
              }
              
              // Utility services
              if (id.includes('services/') && !id.includes('ai') && !id.includes('draft')) {
                return 'core-services-chunk';
              }
              
              // Common components used across views
              if (id.includes('components/ui/') || id.includes('components/common/')) {
                return 'ui-components-chunk';
              }
              
              return undefined;
            },
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          },
          // Enhanced production optimizations
          external: isProduction ? [] : undefined,
          treeshake: isProduction ? {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false
          } : undefined
        },
        emptyOutDir: true,
        chunkSizeWarningLimit: 500, // Reduced from 1000 to encourage smaller chunks
        cssCodeSplit: true, // Enable CSS code splitting
        reportCompressedSize: true
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-dom/client',
          'framer-motion',
          'lodash',
          'axios'
        ],
        exclude: ['@types/node', '@google/genai']
      },
      esbuild: {
        // Use classic JSX transform
        jsx: 'transform' as const,
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment'
      }
    };
});