<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { BaseFiled } from 'agility-core/src/types/base';

interface IAuthApp extends BaseFiled {
    clientName: string;
    clientId: string;
    clientSecret: string;
    contractScopes: Array<string>;
    allowRedirectUris: Array<string>;
    allowGrantTypes: Array<string>;
    isNewRefresh: boolean;
    accessTokenTimeout: number;
    refreshTokenTimeout: number;
    clientTokenTimeout: number;
    lowerClientTokenTimeout: number;
}

const authAppList = ref<IAuthApp[]>([]);
const selectedAuthApp = ref<IAuthApp | null>(null);
const searchQuery = ref('');

// 计算属性过滤列表
const filteredApps = computed(() => {
    return authAppList.value.filter(app =>
        app.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        app.clientId.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const selectApp = (app: IAuthApp) => {
    selectedAuthApp.value = app;
};

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const dataInit = () => {
    request({
        url: '/authApp/queryAll',
        method: 'GET'
    }).then((response: AxiosResponse) => {
        authAppList.value = response.data.data as Array<IAuthApp>;
        if (authAppList.value.length > 0) {
            selectedAuthApp.value = authAppList.value[0];
        }
    });
};
</script>

<template>
    <div class="col-12 sm:col-4 xl:col-3">
        <div class="card flex flex-column max-h-30rem sm:max-h-full sm:h-full">
            <div class="flex flex-column sm:flex-row">
                <div class="flex align-items-center flex-1 gap-2 mb-4">
                    <div class="p-input-icon-left flex-1">
                        <i class="pi pi-search"/>
                        <InputText
                            v-model="searchQuery"
                            class="w-full"
                            placeholder="搜索..."
                        />
                    </div>
                    <Button
                        class="p-button-primary white-space-nowrap"
                        icon="pi pi-plus"
                        @click="console.log(1)"
                    />
                </div>
            </div>
            <ScrollPanel class="h-full min-h-0">
                <div class="app-list">
                    <div
                        v-for="app in filteredApps"
                        :key="app.clientId"
                        :class="{ 'bg-primary-reverse': selectedAuthApp?.id === app.id }"
                        class="app-item py-2 sm:py-3 cursor-pointer border-round flex gap-3"
                        @click="selectApp(app)"
                    >
                        <Avatar image="images/logo.svg" shape="circle" size="large"/>
                        <div>
                            <div class="font-bold mb-1">{{ app.clientName }}</div>
                            <div class="text-sm text-color-secondary">{{ app.clientId }}</div>
                        </div>
                    </div>
                </div>
            </ScrollPanel>
        </div>
    </div>
    <div class="col-12 sm:col-8 xl:col-9 h-full">
        <div class="card h-full py-3">
            <TabView :pt="{
        panelContainer: 'flex min-h-0'
    }" class="flex flex-column max-h-30rem sm:max-h-full sm:h-full">
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar image="images/logo.svg" shape="circle"/>
                            <span class="font-bold white-space-nowrap">应用设置</span>
                        </div>
                    </template>
                    <ScrollPanel class="h-full">
                    </ScrollPanel>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar image="images/logo.svg" shape="circle"/>
                            <span class="font-bold white-space-nowrap">授权设置</span>
                        </div>
                    </template>
                    <ScrollPanel class="h-full">
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                    </ScrollPanel>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar image="images/logo.svg" shape="circle"/>
                            <span class="font-bold white-space-nowrap">其他设置</span>
                        </div>
                    </template>
                    <ScrollPanel class="h-full">
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                    </ScrollPanel>
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<style scoped>
</style>