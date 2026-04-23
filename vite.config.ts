import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // 【关键修改 1】：设置相对路径。
  // 这会让打包后的 index.html 自动变成 ./assets/... 
  // 并且让 React Router 能够识别子目录
  base: './', 

  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.glb'],

  // 【关键修改 2】：强制将资源打包到 assets 文件夹，确保路径可预测
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
