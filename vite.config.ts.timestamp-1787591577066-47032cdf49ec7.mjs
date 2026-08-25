// vite.config.ts
import { defineConfig } from "file:///D:/projects/portfolio/node_modules/vite/dist/node/index.js";
import react from "file:///D:/projects/portfolio/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\projects\\portfolio";
var vite_config_default = defineConfig({
  // Use root base for Vercel; pass --base on CLI when building for GitHub Pages
  base: "/",
  plugins: [react()],
  optimizeDeps: {},
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          icons: ["lucide-react"],
          about: ["./src/components/About"],
          experience: ["./src/components/Experience"],
          skills: ["./src/components/Skills"],
          portfolio: ["./src/components/Portfolio"],
          certifications: ["./src/components/Certifications"],
          contact: ["./src/components/Contact"]
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".");
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    chunkSizeWarningLimit: 1e3,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    assetsInlineLimit: 4096
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxwb3J0Zm9saW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RzXFxcXHBvcnRmb2xpb1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdHMvcG9ydGZvbGlvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgLy8gVXNlIHJvb3QgYmFzZSBmb3IgVmVyY2VsOyBwYXNzIC0tYmFzZSBvbiBDTEkgd2hlbiBidWlsZGluZyBmb3IgR2l0SHViIFBhZ2VzXHJcbiAgYmFzZTogJy8nLFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBvcHRpbWl6ZURlcHM6IHt9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxyXG4gICAgICAgICAgaWNvbnM6IFsnbHVjaWRlLXJlYWN0J10sXHJcbiAgICAgICAgICBhYm91dDogWycuL3NyYy9jb21wb25lbnRzL0Fib3V0J10sXHJcbiAgICAgICAgICBleHBlcmllbmNlOiBbJy4vc3JjL2NvbXBvbmVudHMvRXhwZXJpZW5jZSddLFxyXG4gICAgICAgICAgc2tpbGxzOiBbJy4vc3JjL2NvbXBvbmVudHMvU2tpbGxzJ10sXHJcbiAgICAgICAgICBwb3J0Zm9saW86IFsnLi9zcmMvY29tcG9uZW50cy9Qb3J0Zm9saW8nXSxcclxuICAgICAgICAgIGNlcnRpZmljYXRpb25zOiBbJy4vc3JjL2NvbXBvbmVudHMvQ2VydGlmaWNhdGlvbnMnXSxcclxuICAgICAgICAgIGNvbnRhY3Q6IFsnLi9zcmMvY29tcG9uZW50cy9Db250YWN0J10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaW5mbyA9IGFzc2V0SW5mby5uYW1lPy5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgY29uc3QgZXh0ID0gaW5mbz8uW2luZm8ubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICBpZiAoL3BuZ3xqcGU/Z3xzdmd8Z2lmfHRpZmZ8Ym1wfGljby9pLnRlc3QoZXh0IHx8ICcnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGFzc2V0cy9pbWFnZXMvW25hbWVdLVtoYXNoXVtleHRuYW1lXWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxyXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXHJcbiAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZycsICdjb25zb2xlLmluZm8nXSxcclxuICAgICAgICBwYXNzZXM6IDIsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmdsZToge1xyXG4gICAgICAgIHNhZmFyaTEwOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVQLFNBQVMsb0JBQW9CO0FBQ3BSLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFGeEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixNQUFNO0FBQUEsRUFDTixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsY0FBYyxDQUFDO0FBQUEsRUFDZixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQ3ZDO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDN0IsT0FBTyxDQUFDLGNBQWM7QUFBQSxVQUN0QixPQUFPLENBQUMsd0JBQXdCO0FBQUEsVUFDaEMsWUFBWSxDQUFDLDZCQUE2QjtBQUFBLFVBQzFDLFFBQVEsQ0FBQyx5QkFBeUI7QUFBQSxVQUNsQyxXQUFXLENBQUMsNEJBQTRCO0FBQUEsVUFDeEMsZ0JBQWdCLENBQUMsaUNBQWlDO0FBQUEsVUFDbEQsU0FBUyxDQUFDLDBCQUEwQjtBQUFBLFFBQ3RDO0FBQUEsUUFDQSxnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGdCQUFNLE9BQU8sVUFBVSxNQUFNLE1BQU0sR0FBRztBQUN0QyxnQkFBTSxNQUFNLE9BQU8sS0FBSyxTQUFTLENBQUM7QUFDbEMsY0FBSSxrQ0FBa0MsS0FBSyxPQUFPLEVBQUUsR0FBRztBQUNyRCxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsdUJBQXVCO0FBQUEsSUFDdkIsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2YsWUFBWSxDQUFDLGVBQWUsY0FBYztBQUFBLFFBQzFDLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUNBLG1CQUFtQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ2pDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
