import axios, { AxiosInstance } from 'axios';
import cookie from 'js-cookie';
import router from './router';
import { getParameterByName, globalConfig, signOut } from './globalQuote.ts';

export const url: string = 'http://acs.top:1320';
// export const url: string = 'http://192.168.1.100:1320';

// Axios 实例
const service: AxiosInstance = axios.create({
    baseURL: url,
    timeout: 10000 // 请求超时时间
});

// 设置cross跨域 并设置访问权限 允许跨域携带cookie信息,使用JWT可关闭
service.defaults.withCredentials = true;

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const tokenValue = cookie.get(globalConfig.appTokenName);
        // 将cookie中的token设置在请求头中
        if (tokenValue !== '' && tokenValue !== null && tokenValue !== undefined) {
            config.headers['token'] = tokenValue;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        // 获取后端返回的状态码
        const code = res.data.code;
        switch (code) {
            // Token 失效
            case 700:
            // 未登录
            case 900:
                signOut();
                break;
            // 需要授权
            case 901:
                router.push({
                    path: '/auth/confirm',
                    query: {
                        clientId: res.data.data.clientId,
                        scope: res.data.data.scope,
                        redirect_uri: getParameterByName('redirect_uri')
                    }
                });
                break;
        }
        return res;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default service;
