import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from 'agility-core/src/layout/AppLayout.vue';
import AppTopbar from '@/layout/AppTopbar.vue';
import AppSidebar from '@/layout/AppSidebar.vue';
import AppFooter from '@/layout/AppFooter.vue';
import { getParameterByName, globalConfig } from './globalQuote.ts';
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
                            path: 'userControl',
                            name: 'userControl',
                            component: () => import('@/views/control/UserControl.vue')
                        },
                        {
                            path: 'appControl',
                            name: 'appControl',
                            component: () => import('@/views/control/AppControl.vue')
                        },
                    ]
                },
            ]
        },
        {
            path: '/auth',
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/pages/auth/Login.vue')
                },
                {
                    path: 'confirm',
                    name: 'confirm',
                    component: () => import('@/views/pages/auth/Confirm.vue')
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('@/views/pages/auth/Register.vue')
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
    'login',
    'register',
    'confirm',
    'notFound',
    'notFound',
    'error'
]);

// 路由守卫
router.beforeEach((to, from, next) => {
    // 白名单路由放行
    if (whiteList.value.includes(to.name)) {
        return next();
    }
    // 判断是否携带授权码
    const code = getParameterByName('code');
    const tokenValue = cookie.get(globalConfig.appTokenName);
    if ((tokenValue === '' || tokenValue === null || tokenValue === undefined) && (code === '' || code === null)) {
        alert('未登录!');
        next({
            name: 'login',
            query: {response_type: 'code', client_id: globalConfig.clientId, redirect_uri: globalConfig.indexUrl}
        });
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
                next({
                    name: 'login',
                    query: {
                        response_type: 'code',
                        client_id: globalConfig.clientId,
                        redirect_uri: globalConfig.indexUrl
                    }
                });
            } else if (res.data.code === 200 && res.data.data.tokenValue !== null) {
                // token存入cookie
                cookie.set(globalConfig.appTokenName, res.data.data.tokenValue);
            }
        }).finally(() => {
            window.location.href = globalConfig.indexUrl;
        });
    }
    next();
});

export default router;
