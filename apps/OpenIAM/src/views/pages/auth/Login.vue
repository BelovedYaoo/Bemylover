<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import cookie from 'js-cookie';
import { globalConfig } from '@/service/globalQuote';
import { addClassById, getParameterByName, isValid, responseToastConfig } from 'agility-core/src/service/toolkit';
import router from '@/service/router';
import LogoSvg from '@/components/LogoSvg.vue';
import YiYan from 'agility-core/src/components/YiYan.vue';
import axios, { AxiosResponse } from 'axios';
import { sha256 } from 'hash.js';

const toast = useToast();

const openId = ref('');
const password = ref('');
const remember = ref(false);
const checked = ref(false);

const responseType = ref('');
const clientId = ref('');
const redirectUri = ref('');

const passwordIsFocus = ref(false);
const openIdIsFocus = ref(false);

const errorToast = (className: string, summary: string, detail: string) => {
    toast.add({
        severity: 'error',
        summary: summary,
        detail: detail,
        life: 3000
    });
    addClassById(className, 'p-invalid');
    checked.value = false;
};

const checkRegisterAccountInfo = () => {
    if (openId.value === '') {
        errorToast('openId', '你有地方没填写喔~', '账号不能为空');
    }

    if (password.value === '') {
        errorToast('password', '你有地方没填写喔~', '密码不能为空');
    }
};

onMounted(() => {
    const tokenValue = cookie.get('openToken');
    // 如果没有Token
    if (tokenValue === '' || tokenValue === null || tokenValue === undefined) {
        responseType.value = getParameterByName('response_type');
        clientId.value = getParameterByName('client_id');
        redirectUri.value = getParameterByName('redirect_uri');
        // 如果缺少参数
        if (!isValid(responseType.value) || !isValid(clientId.value) || !isValid(redirectUri.value)) {
            window.location.href = `${globalConfig.openAuthServerUrl}?response_type=code&client_id=${globalConfig.clientId}&redirect_uri=${globalConfig.indexUrl}`;
        }
        return;
    }
    code();
});

const login = () => {
    checked.value = true;
    checkRegisterAccountInfo();
    if (!checked.value) {
        return;
    }
    axios.request({
        method: 'POST',
        url: 'http://openiam.top:8091/oauth2/doLogin',
        params: {
            username: openId.value,
            password: btoa(sha256().update(password.value).digest('hex'))
        }
    }).then((res: AxiosResponse) => {
        toast.add(responseToastConfig(res));
        if (res.data.code === 200 && res.data.data.tokenValue !== null) {
            // token存入cookie
            cookie.set('openToken', res.data.data.tokenValue);
            // 页面跳转
            code();
        }
    });
};

const code = () => {
    // 如果缺少参数
    if (!isValid(responseType.value) || !isValid(clientId.value) || !isValid(redirectUri.value)) {
        return;
    }
    alert('通过OIDC协议登录！');
    axios.request({
        headers: {
            'Content-Type': 'application/json',
            [globalConfig.openAuthServerTokenName]: cookie.get(globalConfig.openAuthServerTokenName)
        },
        method: 'POST',
        url: 'http://openiam.top:8091/oauth2/authorize',
        params: {
            // eslint-disable-next-line camelcase
            response_type: responseType.value,
            // eslint-disable-next-line camelcase
            client_id: clientId.value,
            // eslint-disable-next-line camelcase
            redirect_uri: redirectUri.value,
            scope: 'oidc'
        },
    }).then((res: AxiosResponse) => {
        if (res.data.code === 200) {
            window.location.href = res.data.data;
        } else if (res.data.code === 901) {
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
        } else if (res.data.code === 902) {
            router.push({
                path: '/access',
                query: {backSteps: 2}
            }).then(() => {
                toast.add(responseToastConfig(res));
            });
        }
    });
};
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pt-7 pb-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <LogoSvg displayHeight="70" marginBottom="mb-1"/>
                        <div class="text-900 text-3xl font-bold mb-3">{{ globalConfig.appName }}</div>
                        <div style="width: 330px; height: 20px">
                            <YiYan/>
                        </div>
                    </div>
                    <div class="pt-3">
                        <span class="p-float-label mb-5">
                            <InputText id="openId" v-model="openId" autofocus class="w-full p-3"
                                       @blur="openIdIsFocus = false" @focus="openIdIsFocus = true"/>
                            <label
                                :class="{ 'text-600': openIdIsFocus || openId.length > 0, 'text-500': !openIdIsFocus }"
                                class="font-bold ml-1" for="username">Open ID</label>
                        </span>
                        <span class="p-float-label mb-4">
                            <Password
                                id="password"
                                v-model="password"
                                :feedback="false"
                                :toggleMask="true"
                                class="w-full"
                                inputClass="w-full p-3 font-bold"
                                @blur="passwordIsFocus = false"
                                @focus="passwordIsFocus = true"
                            ></Password>
                            <label
                                :class="{ 'text-600': passwordIsFocus || password.length > 0, 'text-500': !passwordIsFocus }"
                                class="font-bold ml-1" for="password">Password</label>
                        </span>

                        <div class="flex align-items-center justify-content-between pt-3 mb-3 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox id="remember" v-model="remember" binary class="mr-2"></Checkbox>
                                <label for="remember">记住我</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                               style="color: var(--primary-color)">游客访问</a>
                        </div>
                        <Button class="w-full p-3 text-xl" label="登录" @click="login()"></Button>
                        <div class="flex align-items-center justify-content-between pt-3 mt-0 gap-5">
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                               style="color: var(--primary-color)">忘记密码</a>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                               style="color: var(--primary-color)"
                               @click="router.push({ path: '/auth/register' })">注册账号</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
