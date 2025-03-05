import { AppConfig } from '@/service/globalQuote';
import cookie from 'js-cookie';
import router from '@/service/router';

export const signOut = () => {
    // 清除token
    cookie.remove(globalConfig.tokenName);
    // 页面跳转
    router.push({name: 'login'});
};

interface AppConfig {
    appName: string;
    tokenName: string;
    clientId: string;
    indexUrl: string;
}

/**
 * 全局配置
 */
export const globalConfig: AppConfig = {
    // 应用名称
    appName: 'OpenIAM',
    // Token名称
    tokenName: 'openToken',
    // 主页URL
    indexUrl: 'http://openiam.top:9036/#/',
};