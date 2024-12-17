import {
    createRouter,
    createWebHashHistory,
    NavigationGuardNext,
    RouteLocationNormalizedGeneric,
    RouteLocationNormalizedLoadedGeneric
} from 'vue-router';
import AppLayout from 'agility-core/src/layout/AppLayout.vue';
import AppTopbar from '@/layout/AppTopbar.vue';
import AppSidebar from '@/layout/AppSidebar.vue';
import AppFooter from '@/layout/AppFooter.vue';
import { globalConfig } from './globalQuote.ts';
import { getParameterByName, isNotValid, isValid } from 'agility-core/src/service/toolkit';
import cookie from 'js-cookie';
import { AxiosResponse } from 'axios';
import request from '@/service/request';
import { ref } from 'vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            props: () => ({
                appTopbar: AppTopbar,
                appSidebar: AppSidebar,
                appFooter: AppFooter,
                isFlex: [],
            }),
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/control',
                    children: [
                        {
                            path: 'classSchedule',
                            name: 'classSchedule',
                            component: () => import('@/views/control/ClassSchedule.vue')
                        },
                        {
                            path: 'enterpriseConfig',
                            name: 'enterpriseConfig',
                            component: () => import('@/views/control/EnterpriseConfig.vue')
                        },
                    ]
                },
            ]
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/Access.vue')
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('@/views/pages/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

const whiteList = ref([
    'confirm',
    'notFound',
    'error'
]);

// 路由守卫
router.beforeEach((to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric, next: NavigationGuardNext): void => {
    // 白名单路由放行
    if (whiteList.value.includes(to.name)) {
        return next();
    }
    // 获取授权码 Code
    const code: string = getParameterByName('code');
    // 如果存在授权码 Code，通过授权码 Code 登录
    if (isValid(code)) {
        request({
            method: 'GET',
            url: '/openAuth/codeLogin',
            params: {
                code: code,
            }
        }).then((res: AxiosResponse): void => {
            // 如果存在 Token，存储 Token 并进入首页
            if (isValid(res.data.data.tokenValue)) {
                cookie.set(globalConfig.appTokenName, res.data.data.tokenValue);
                window.location.href = globalConfig.indexUrl;
            }
        });
    }
    // 获取 Token
    const tokenValue: string = cookie.get(globalConfig.appTokenName);
    // 如果存在 Token，直接放行
    // 否则，如果不存在 Code，跳转到登录页面
    // Token 的有效性判断会在网络请求中进行
    if (isValid(tokenValue)) {
        return next();
    } else if (isNotValid(code)) {
        window.location.href = `${globalConfig.openAuthServerUrl}?response_type=code&client_id=${globalConfig.clientId}&redirect_uri=${globalConfig.indexUrl}`;
    }
});

export default router;
