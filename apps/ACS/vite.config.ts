import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        server: {
            port: 132,
            allowedHosts: ['acs.top']
        },
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
    };
});
