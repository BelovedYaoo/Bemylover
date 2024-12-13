import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from 'agility-core/src/layout/AppLayout.vue';
import AppTopbar from '@/layout/AppTopbar.vue';
import AppSidebar from '@/layout/AppSidebar.vue';
import AppFooter from '@/layout/AppFooter.vue';
import { globalConfig } from './globalQuote.ts';
import { getParameterByName } from 'agility-core/src/service/toolkit';
import cookie from 'js-cookie';
import { AxiosResponse } from 'axios';
import request from '@/service/request';

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

// 路由守卫
router.beforeEach((to, from, next) => {
    // 判断是否携带授权码
    const code = getParameterByName('code');
    const tokenValue = cookie.get(globalConfig.appTokenName);
    if ((tokenValue === '' || tokenValue === null || tokenValue === undefined) && (code === '' || code === null)) {
        alert('未登录!');
        return window.location.href = `${globalConfig.openAuthServerUrl}?response_type=code&client_id=${globalConfig.clientId}&redirect_uri=${globalConfig.indexUrl}`;
    } else if (code !== '' && code !== null && code !== undefined) {
        request({
            method: 'GET',
            url: '/openAuth/codeLogin',
            params: {
                code: code,
            }
        }).then((res: AxiosResponse) => {
            if (res.data.code !== 200 && (tokenValue === '' || tokenValue === null || tokenValue === undefined)) {
                alert('未登录');
                return window.location.href = `${globalConfig.openAuthServerUrl}?response_type=code&client_id=${globalConfig.clientId}&redirect_uri=${globalConfig.indexUrl}`;
            }
        }).finally(() => {
            window.location.href = globalConfig.indexUrl;
        });
    }
    next();
});

export default router;
