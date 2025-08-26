import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      base: '/',
      plugins: [
        react({
          // Fix for jsxDEV error in production
          jsxRuntime: 'automatic',
          jsxImportSource: 'react',
          // Ensure production build doesn't include dev runtime
          babel: {
            plugins: [],
            presets: []
          }
        }),
        // Copy service worker to dist folder - only during build
        {
          name: 'copy-sw',
          apply: 'build',
          generateBundle() {
            return new Promise((resolve) => {
              import('fs').then(({ copyFileSync, existsSync }) => {
                import('path').then(({ resolve: pathResolve }) => {
                  try {
                    const swPath = pathResolve(process.cwd(), 'sw.js');
                    const distPath = pathResolve(process.cwd(), 'dist/sw.js');
                    
                    if (existsSync(swPath)) {
                      copyFileSync(swPath, distPath);
                      console.log('✓ Service worker copied to dist/sw.js');
                    } else {
                      console.log('ℹ Service worker not found, skipping copy');
                    }
                  } catch (error) {
                    console.warn('⚠ Failed to copy service worker:', error instanceof Error ? error.message : String(error));
                  }
                  resolve();
                }).catch(() => resolve());
              }).catch(() => resolve());
            });
          }
        }
      ],
      define: {
        'global': 'globalThis',
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        '__DEV__': !isProduction,
        '__PROD__': isProduction,
        // Fix for React JSX runtime
        'process.env.REACT_JSX_RUNTIME': JSON.stringify('automatic')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          'crypto': 'crypto-browserify',
          'stream': 'stream-browserify',
          'util': 'util',
          'events': 'events',
          '@components': path.resolve(__dirname, 'components'),
          '@services': path.resolve(__dirname, 'services'),
          '@hooks': path.resolve(__dirname, 'hooks'),
          '@utils': path.resolve(__dirname, 'utils'),
          '@types': path.resolve(__dirname, 'types.ts'),
          'buffer': 'buffer'
        }
      },
      build: {
        target: 'es2020',
        minify: isProduction ? 'esbuild' : false,
        cssMinify: isProduction,
        sourcemap: isProduction ? false : true,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          output: {
            manualChunks: undefined,
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          },
          external: [],
          onwarn(warning, warn) {
            if (warning.code === 'UNRESOLVED_IMPORT') return;
            if (warning.code === 'THIS_IS_UNDEFINED') return;
            if (warning.code === 'CIRCULAR_DEPENDENCY') return;
            warn(warning);
          }
        },
        assetsInlineLimit: 2048,
        cssCodeSplit: true,
        modulePreload: { polyfill: true },
        reportCompressedSize: true,
        emptyOutDir: true,
        assetsDir: 'assets',
        copyPublicDir: true
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-dom/client',
          'react/jsx-runtime',
          'scheduler',
          'framer-motion',
          'lucide-react',
          'recharts',
          '@dnd-kit/core',
          '@dnd-kit/sortable'
        ],
        exclude: ['@types/node', 'react/jsx-dev-runtime'],
        esbuildOptions: {
          target: 'es2020',
          keepNames: true
        }
      },
      publicDir: 'public',
      cacheDir: 'node_modules/.vite',
      server: {
        host: true,
        port: 8765,
        strictPort: true,
        open: false,
        cors: true,
        hmr: {
          overlay: !isProduction
        }
      },
      preview: {
        port: 8766,
        host: true,
        strictPort: true,
        open: false
      },
      esbuild: {
        treeShaking: true,
        drop: isProduction ? ['debugger'] : [],
        pure: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
        minifyIdentifiers: isProduction,
        minifySyntax: isProduction,
        minifyWhitespace: isProduction,
        // Fix JSX for production
        jsx: 'automatic',
        jsxImportSource: 'react'
      },
      css: {
        modules: {
          localsConvention: 'camelCase'
        }
      }
    };
});