import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }: { mode: string }) => {
    const isProduction = mode === 'production';
    
    return {
      base: '/',
      plugins: [
        react({
          // Use classic JSX runtime to avoid jsxDEV issues
          jsxRuntime: 'classic',
          jsxImportSource: undefined,
          babel: {
            plugins: [],
            presets: []
          }
        }),
        // Add PWA plugin for enhanced caching
        ...(isProduction ? [{
          name: 'performance-hints',
          generateBundle(options: any, bundle: any) {
            // Analyze bundle and provide performance hints
            Object.keys(bundle).forEach((fileName: any) => {
              const chunk = bundle[fileName];
              if (chunk.type === 'chunk' && chunk.code) {
                const size = new TextEncoder().encode(chunk.code).length;
                if (size > 500 * 1024) { // 500KB
                  console.warn(`⚠️ Large chunk detected: ${fileName} (${(size/1024).toFixed(2)}KB)`);
                }
              }
            });
          }
        }] : [])
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
        // Performance optimizations
        cssMinify: isProduction,
        assetsInlineLimit: 4096, // Inline assets under 4KB
        rollupOptions: {
          output: {
            manualChunks(id) {
              // Core vendor chunks
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react')) {
                return 'vendor-ui';
              }
              if (id.includes('node_modules/lodash') || id.includes('node_modules/axios') || id.includes('node_modules/crypto-browserify')) {
                return 'vendor-utils';
              }
              
              // AI and analytics vendors (heavy dependencies)
              if (id.includes('node_modules/@google/generative-ai') || id.includes('openai') || id.includes('recharts')) {
                return 'vendor-ai-analytics';
              }
              
              // Feature-based chunks for code splitting
              if (id.includes('views/') && (id.includes('DraftRoom') || id.includes('Draft'))) {
                return 'draft-features';
              }
              if (id.includes('components/admin/') || id.includes('views/') && id.includes('Commissioner')) {
                return 'admin-features';
              }
              if (id.includes('components/ai/') || id.includes('Oracle') || id.includes('AI')) {
                return 'ai-features';
              }
              if (id.includes('components/analytics/') || id.includes('Analytics') || id.includes('metrics')) {
                return 'analytics-features';
              }
              
              // Split player features into smaller chunks
              if (id.includes('components/player/tabs/')) {
                return 'player-tabs';
              }
              if (id.includes('components/player/') && (id.includes('Detail') || id.includes('Modal'))) {
                return 'player-details';
              }
              if (id.includes('components/player/') || id.includes('Player') || id.includes('views/') && id.includes('Players')) {
                return 'player-core';
              }
              
              // UI component chunks
              if (id.includes('components/ui/') || id.includes('components/common/')) {
                return 'ui-components';
              }
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
        chunkSizeWarningLimit: 100, // Warn at 100KB instead of 500KB to encourage smaller chunks
        cssCodeSplit: true, // Enable CSS code splitting
        // Advanced performance settings
        reportCompressedSize: isProduction,
        terserOptions: isProduction ? {
          compress: {
            drop_console: true, // Remove console.logs in production
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2, // Run compression twice for better results
            dead_code: true,
            unused: true
          },
          mangle: {
            safari10: true,
            properties: {
              regex: /^_/ // Mangle private properties starting with _
            }
          },
          format: {
            comments: false, // Remove all comments
            safari10: true
          }
        } : undefined,
        // Advanced production optimizations
        modulePreload: {
          polyfill: false // Use native module preload if supported
        },
        // Experimental optimizations
        experimentalMinifyGlobalThis: isProduction
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