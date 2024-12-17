import axios, { AxiosInstance } from 'axios';
import cookie from 'js-cookie';
import router from '@/service/router';
import { globalConfig, signOut } from './globalQuote.ts';
import { getParameterByName, isValid } from 'agility-core/src/service/toolkit';

export const url: string = 'http://openiam.top:8090';
// export const url: string = 'http://192.168.1.100:8090';

// Axios 实例
const service: AxiosInstance = axios.create({
    baseURL: url,
    timeout: 10000 // 请求超时时间
});

// 设置cross跨域 并设置访问权限 允许跨域携带cookie信息,使用JWT可关闭
service.defaults.withCredentials = false;

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const tokenValue: string = cookie.get(globalConfig.appTokenName);
        // 将cookie中的token设置在请求头中
        if (isValid(tokenValue)) {
            config.headers[globalConfig.appTokenName] = tokenValue;
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
            // 会话失效
            case 700:
            // 未登录
            case 900:
                signOut();
                break;
            case 500:
                // 清除token
                cookie.remove(globalConfig.appTokenName);
                break;
            // 需要授权
            case 901:
                router.push({
                    path: '/auth/confirm',
                    query: {
                        // eslint-disable-next-line camelcase
                        client_id: res.data.data.client_id,
                        scope: res.data.data.scope,
                        // eslint-disable-next-line camelcase
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
