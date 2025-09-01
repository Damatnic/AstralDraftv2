import path from &apos;path&apos;;
import { defineConfig } from &apos;vite&apos;;
import react from &apos;@vitejs/plugin-react&apos;;

// EMERGENCY PERFORMANCE CONFIGURATION
// This config achieves maximum bundle size reduction through aggressive splitting

export default defineConfig(({ mode }: { mode: string }) => {
}
    const isProduction = mode === &apos;production&apos;;
    
    return {
}
      base: &apos;/&apos;,
      plugins: [
        react({
}
          jsxRuntime: &apos;classic&apos;,
          jsxImportSource: undefined,
          babel: {
}
            plugins: [],
            presets: []
          }
        }),
      ],
      define: {
}
        &apos;global&apos;: &apos;globalThis&apos;,
        &apos;process.env.NODE_ENV&apos;: JSON.stringify(isProduction ? &apos;production&apos; : &apos;development&apos;)
      },
      resolve: {
}
        alias: {
}
          &apos;@&apos;: path.resolve(__dirname, &apos;.&apos;),
          // Replace heavy libraries with lighter alternatives
          &apos;lodash&apos;: &apos;lodash-es&apos;,
          &apos;moment&apos;: &apos;dayjs&apos;,
          &apos;crypto&apos;: &apos;crypto-browserify&apos;,
          &apos;stream&apos;: &apos;stream-browserify&apos;,
          &apos;util&apos;: &apos;util&apos;,
          &apos;events&apos;: &apos;events&apos;,
          &apos;buffer&apos;: &apos;buffer&apos;
        }
      },
      build: {
}
        target: &apos;es2020&apos;,
        minify: isProduction ? &apos;terser&apos; : false,
        terserOptions: isProduction ? {
}
          compress: {
}
            drop_console: true,
            drop_debugger: true,
            pure_funcs: [&apos;console.log&apos;, &apos;console.info&apos;, &apos;console.debug&apos;, &apos;console.trace&apos;],
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
}
            safari10: true,
            toplevel: true,
            properties: {
}
              regex: /^_/,
            }
          },
          format: {
}
            comments: false,
            ecma: 2020,
          },
          module: true,
          toplevel: true,
        } : undefined,
        sourcemap: false,
        cssMinify: isProduction ? &apos;esbuild&apos; : false,
        assetsInlineLimit: 8192, // Inline smaller assets
        rollupOptions: {
}
          output: {
}
            // Aggressive manual chunking strategy
            manualChunks: (id: any) => {
}
              // Core React (essential)
              if (id.includes(&apos;react&apos;) || id.includes(&apos;react-dom&apos;)) {
}
                if (id.includes(&apos;react-dom&apos;)) return &apos;react-dom&apos;;
                return &apos;react-core&apos;;
              }
              
              // Heavy animation library
              if (id.includes(&apos;framer-motion&apos;)) {
}
                return &apos;animation&apos;;
              }
              
              // Chart libraries (lazy loaded)
              if (id.includes(&apos;chart.js&apos;) || id.includes(&apos;recharts&apos;)) {
}
                return &apos;charts&apos;;
              }
              
              // Icons (lazy loaded)
              if (id.includes(&apos;lucide-react&apos;) || id.includes(&apos;react-icons&apos;)) {
}
                return &apos;icons&apos;;
              }
              
              // Payment (lazy loaded)
              if (id.includes(&apos;stripe&apos;)) {
}
                return &apos;payment&apos;;
              }
              
              // DnD (lazy loaded)
              if (id.includes(&apos;@dnd-kit&apos;)) {
}
                return &apos;dnd&apos;;
              }
              
              // Socket/WebSocket (lazy loaded)
              if (id.includes(&apos;socket.io&apos;)) {
}
                return &apos;realtime&apos;;
              }
              
              // Utilities
              if (id.includes(&apos;lodash&apos;) || id.includes(&apos;axios&apos;)) {
}
                return &apos;utils&apos;;
              }
              
              // All other vendor code
              if (id.includes(&apos;node_modules&apos;)) {
}
                // Group smaller libraries together
                const module = id.split(&apos;node_modules/&apos;)[1];
                const packageName = module.split(&apos;/&apos;)[0];
                
                // Group small packages together
                const smallPackages = [
                  &apos;tslib&apos;, &apos;classnames&apos;, &apos;clsx&apos;, &apos;tiny-invariant&apos;,
                  &apos;warning&apos;, &apos;object-assign&apos;, &apos;prop-types&apos;
                ];
                
                if (smallPackages.some((pkg: any) => packageName.includes(pkg))) {
}
                  return &apos;vendor-small&apos;;
                }
                
                return &apos;vendor&apos;;
              }
              
              // Feature-based splitting for app code
              if (id.includes(&apos;/components/draft/&apos;)) return &apos;draft&apos;;
              if (id.includes(&apos;/components/matchup/&apos;)) return &apos;matchup&apos;;
              if (id.includes(&apos;/components/player/&apos;)) return &apos;players&apos;;
              if (id.includes(&apos;/components/trade/&apos;)) return &apos;trade&apos;;
              if (id.includes(&apos;/components/waiver/&apos;)) return &apos;waiver&apos;;
              if (id.includes(&apos;/components/research/&apos;)) return &apos;research&apos;;
              if (id.includes(&apos;/components/admin/&apos;)) return &apos;admin&apos;;
              if (id.includes(&apos;/components/auth/&apos;)) return &apos;auth&apos;;
              if (id.includes(&apos;/components/settings/&apos;)) return &apos;settings&apos;;
              if (id.includes(&apos;/services/&apos;)) return &apos;services&apos;;
              if (id.includes(&apos;/hooks/&apos;)) return &apos;hooks&apos;;
              if (id.includes(&apos;/utils/&apos;)) return &apos;utilities&apos;;
              if (id.includes(&apos;/contexts/&apos;)) return &apos;contexts&apos;;
            },
            
            // Optimize chunk names
            entryFileNames: isProduction ? &apos;[name].[hash:8].js&apos; : &apos;[name].js&apos;,
            chunkFileNames: (chunkInfo: any) => {
}
              const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId : &apos;&apos;;
              
              // Critical chunks get shorter hashes
              if (chunkInfo.name === &apos;react-core&apos; || chunkInfo.name === &apos;react-dom&apos;) {
}
                return isProduction ? &apos;[name].[hash:6].js&apos; : &apos;[name].js&apos;;
              }
              
              // Feature chunks
              if (chunkInfo.name?.startsWith(&apos;feature-&apos;) || 
                  chunkInfo.name?.includes(&apos;View&apos;)) {
}
                return isProduction ? &apos;features/[name].[hash:8].js&apos; : &apos;features/[name].js&apos;;
              }
              
              // Vendor chunks
              if (chunkInfo.name?.startsWith(&apos;vendor&apos;) || 
                  chunkInfo.name === &apos;animation&apos; ||
                  chunkInfo.name === &apos;charts&apos; ||
                  chunkInfo.name === &apos;icons&apos;) {
}
                return isProduction ? &apos;vendor/[name].[hash:8].js&apos; : &apos;vendor/[name].js&apos;;
              }
              
              // Default
              return isProduction ? &apos;chunks/[name].[hash:8].js&apos; : &apos;chunks/[name].js&apos;;
            },
            
            // Optimize asset file names
            assetFileNames: (assetInfo: any) => {
}
              const info = assetInfo.name?.split(&apos;.&apos;);
              const ext = info?.[info.length - 1];
              
              // Images
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || &apos;&apos;)) {
}
                return &apos;img/[name].[hash:8][extname]&apos;;
              }
              
              // Fonts
              if (/woff2?|ttf|otf|eot/i.test(ext || &apos;&apos;)) {
}
                return &apos;fonts/[name].[hash:8][extname]&apos;;
              }
              
              // CSS
              if (ext === &apos;css&apos;) {
}
                return &apos;css/[name].[hash:8][extname]&apos;;
              }
              
              return &apos;assets/[name].[hash:8][extname]&apos;;
            },
            
            // Preserve module structure for better tree shaking
            preserveModules: false,
          },
          
          // Tree shaking optimizations
          treeshake: {
}
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
            correctVarValueBeforeDeclaration: true,
            preset: &apos;smallest&apos;,
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
}
          polyfill: true,
        },
        
        // Common JS optimization
        commonjsOptions: {
}
          transformMixedEsModules: true,
          requireReturnsDefault: &apos;auto&apos;,
        },
      },
      
      // Optimize dependencies
      optimizeDeps: {
}
        include: [
          &apos;react&apos;,
          &apos;react-dom&apos;,
          &apos;react-dom/client&apos;,
        ],
        exclude: [
          &apos;@types/node&apos;,
          &apos;@google/genai&apos;,
          // Exclude heavy dependencies that should be lazy loaded
          &apos;chart.js&apos;,
          &apos;recharts&apos;,
          &apos;framer-motion&apos;,
          &apos;@dnd-kit/core&apos;,
          &apos;@dnd-kit/sortable&apos;,
          &apos;socket.io-client&apos;,
        ],
        esbuildOptions: {
}
          target: &apos;es2020&apos;,
          supported: {
}
            bigint: true,
          },
        },
      },
      
      // Development optimizations
      server: {
}
        hmr: {
}
          overlay: false, // Disable error overlay in dev
        },
      },
      
      // ESBuild optimizations
      esbuild: {
}
        jsx: &apos;transform&apos;,
        jsxFactory: &apos;React.createElement&apos;,
        jsxFragment: &apos;React.Fragment&apos;,
        legalComments: &apos;none&apos;,
        logOverride: { &apos;this-is-undefined-in-esm&apos;: &apos;silent&apos; },
        treeShaking: true,
        minifyIdentifiers: isProduction,
        minifySyntax: isProduction,
        minifyWhitespace: isProduction,
      },
      
      // Additional performance hints
      logLevel: isProduction ? &apos;warn&apos; : &apos;info&apos;,
    };
});