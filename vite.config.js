import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import ReactivityTransform from '@vue-macros/reactivity-transform/dist/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import DefineOptions from 'unplugin-vue-define-options/vite';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDEV = mode === 'development';
  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        api: path.resolve(__dirname, 'src/api'),
        assets: path.resolve(__dirname, 'src/assets'),
        utils: path.resolve(__dirname, 'src/utils'),
        views: path.resolve(__dirname, 'src/views'),
      },
      extensions: ['.js', '.json', '.ts', '.vue'],
    },
    plugins: [
      vue(),
      DefineOptions(),
      ReactivityTransform(),
      AutoImport({
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        imports: ['vue', '@vueuse/core'],
      }),
      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver(),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
      UnoCSS({
        configFile: './uno.config.ts',
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    server: {
      host: '0.0.0.0',
      open: true,
      hmr: true,
      proxy: {
        '/api': {
          target: 'https://app.or-intech.com',
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace('/api', ''),
        },
      },
    },
    esbuild: {
      pure: isDEV ? [] : ['console.log', 'debugger'],
    },
    build: {
      target: 'es2015',
      sourcemap: isDEV ? 'inline' : false,
    },
  };
});
