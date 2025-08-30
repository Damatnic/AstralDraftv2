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
            manualChunks: {
              vendor: ['react', 'react-dom'],
              motion: ['framer-motion'],
              ai: ['@google/genai'],
              charts: ['recharts', 'chart.js', 'react-chartjs-2'],
              icons: ['lucide-react', 'react-icons'],
              utils: ['lodash', 'axios']
            },
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          },
          // Production optimizations
          external: isProduction ? [] : undefined,
          treeshake: isProduction ? {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false
          } : undefined
        },
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000
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