import { AppConfig } from '@/service/globalQuote';
import cookie from 'js-cookie';

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