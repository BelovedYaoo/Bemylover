import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// import { codeInspectorPlugin } from 'code-inspector-plugin';

// https://vitejs.dev/config/
export default defineConfig({
        server: {
            port: 9036,
            allowedHosts: ['openiam.top']
        //     proxy: {
        //         // 韩小韩Api
        //         '/vvhan': {
        //             // 目标地址
        //             target: 'https://api.vvhan.com/api',
        //             // 是否改变源
        //             changeOrigin: true,
        //             // 重写路径
        //             rewrite: (path: string) => path.replace(/^\/vvhan/, '')
        //         },
        //         // 夏柔Api
        //         '/yiyan': {
        //             // 目标地址
        //             target: 'https://v1.hitokoto.cn?encode=text',
        //             // 是否改变源
        //             changeOrigin: true,
        //             // 重写路径
        //             rewrite: (path: string) => path.replace(/^\/yiyan/, '')
        //         },
        //         // TenApi
        //         '/tenapi': {
        //             // 目标地址
        //             target: 'https://tenapi.cn/v2',
        //             // 是否改变源
        //             changeOrigin: true,
        //             // 重写路径
        //             rewrite: (path: string) => path.replace(/^\/tenapi/, '')
        //         },
        //         // uapis
        //         '/uapis': {
        //             // 目标地址
        //             target: 'https://uapis.cn/api',
        //             // 是否改变源
        //             changeOrigin: true,
        //             // 重写路径
        //             rewrite: (path: string) => path.replace(/^\/uapis/, '')
        //         }
        //     }
        },
        plugins: [
            vue(),
            // codeInspectorPlugin({
            //     bundler: 'vite',
            // }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
    }
);
