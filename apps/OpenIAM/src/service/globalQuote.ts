import { AppConfig } from '@/service/globalQuote';
import cookie from 'js-cookie';
import router from '@/service/router';

export const signOut = () => {
    // 清除token
    cookie.remove(globalConfig.appTokenName);
    // 页面跳转
    router.push({
        name: 'login',
        query: {
            // eslint-disable-next-line camelcase
            response_type: 'code',
            // eslint-disable-next-line camelcase
            client_id: globalConfig.clientId,
            // eslint-disable-next-line camelcase
            redirect_uri: globalConfig.indexUrl
        }
    });
};

interface AppConfig {
    appName: string;
    appTokenName: string;
    openAuthServerUrl: string;
    openAuthServerTokenName: string;
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
    appTokenName: 'iamToken',
    // OpenAuth 认证服务URL
    openAuthServerUrl: 'http://openiam.top:9036/#/auth/login',
    // OpenAuth 认证服务Token名称
    openAuthServerTokenName: 'openToken',
    // OpenAuth 应用端ID
    clientId: '1000',
    // 主页URL
    indexUrl: 'http://openiam.top:9036/#/',
};