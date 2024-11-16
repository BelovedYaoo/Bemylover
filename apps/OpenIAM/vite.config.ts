import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { codeInspectorPlugin } from 'code-inspector-plugin';

// https://vitejs.dev/config/
export default defineConfig({
        server: {
            port: 9036,
            // proxy: yiyanProxy
        },
        plugins: [
            vue(),
            codeInspectorPlugin({
                bundler: 'vite',
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
    }
);
