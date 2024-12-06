import { AxiosResponse } from 'axios';
import { ToastMessageOptions } from 'primevue/toast';
import { AppConfig } from '@/service/globalQuote';
import cookie from 'js-cookie';

/**
 * 将Axios请求响应体转换为PrimeVue的Toast配置
 * @param response Axios响应体
 * @param duringSecond Toast显示时长(默认3秒)
 */
export const responseToastConfig = (response: AxiosResponse<any>, duringSecond: number = 3): ToastMessageOptions => {
    return {
        severity: response.data.code === 200 ? 'success' : 'error',
        summary: response.data.message,
        detail: response.data.description,
        life: duringSecond * 1000
    };
};

/**
 * 将类名添加到指定id的元素上，并设置延时移除
 * @param id 需要添加的元素id名
 * @param className 被添加的类名
 * @param duringSecond 延时时长(默认5秒延时)
 */
export const addClassById = (id: string, className: string, duringSecond: number = 5): void => {
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
        element.classList.add(className);
        setTimeout((): void => {
            element.classList.remove(className);
        }, duringSecond * 1000);
    }
};

export const getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${  name  }(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const signOut = () => {
    // 清除token
    cookie.remove(globalConfig.appTokenName);
    // 页面跳转
    window.location.href = `${globalConfig.openAuthServerUrl}?response_type=code&client_id=${globalConfig.clientId}&redirect_uri=${globalConfig.indexUrl}`;
};

interface AppConfig {
    appName: string;
    appTokenName: string;
    openAuthServerUrl: string;
    clientId: string;
    indexUrl: string;
}

/**
 * 全局配置
 */
export const globalConfig: AppConfig = {
    // 应用名称
    appName: 'ACS Server',
    // Token名称
    appTokenName: 'acsToken',
    // OpenAuth 认证服务URL
    openAuthServerUrl: 'http://openiam.top:9036/#/auth/login',
    // OpenAuth 应用端ID
    clientId: '1001',
    // 主页URL
    indexUrl: 'http://acs.top:132/#/',
};