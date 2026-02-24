import {fileURLToPath, URL} from 'node:url'
import path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'
import {visualizer} from 'rollup-plugin-visualizer'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'report.html',
      gzipSize: true,
      emitFile: true
    }),
    AutoImport({
      imports: ['vue'], // 自动引入 vue 相关函数
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({autoInstall: true}),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[name]',
      inject: 'body-first'
    }),
    legacy({
      targets: ['chrome < 65'] // 兼容低版本浏览器，有些语法不支持，比如可选链(?.)
    })
  ],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        customEl: 'customEl.html'
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const fileName = assetInfo.name
          const nameList = fileName!.split('.')
          const ext = nameList[nameList.length - 1]
          if (['jpg', 'jpeg', 'png', 'svg', 'webp', 'bmp', 'gif'].includes(ext.toLowerCase())) {
            return 'image/[name].[hash][extname]'
          } else return 'style/[name].[hash][extname]'
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8088,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://admin-system.brokersshow.com',
        changeOrigin: true
      }
    }
  }
})
