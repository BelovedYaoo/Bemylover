<!--suppress VueUnrecognizedDirective -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { BaseFiled } from 'agility-core/src/types/base';
import { StoreStateInterface, useAgilityCoreStore } from 'agility-core/src/service/store';
import { storeToRefs } from 'pinia';

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
const enableClientEdit = ref(false);
const store = useAgilityCoreStore();
const {inSM} = storeToRefs<StoreStateInterface>(store);

// 计算属性过滤列表
const filteredApps = computed(() => {
    return authAppList.value.filter(app =>
        app.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        app.clientId.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const selectApp = (app: IAuthApp) => {
    selectedAuthApp.value = JSON.parse(JSON.stringify(app));
};

onMounted(() => {
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
            selectApp(authAppList.value[0]);
        }
    });
};

// 判断是否需要显示重置按钮
const isDirty = computed(() => {
    if (!selectedAuthApp.value) return false;
    const original = authAppList.value.find(a => a.clientId === selectedAuthApp.value!.clientId);
    return JSON.stringify(original) !== JSON.stringify(selectedAuthApp.value);
});

// 重置数据
const revertChanges = () => {
    if (!selectedAuthApp.value) return;
    // 从原始数据中恢复当前选中项
    const originalApp = authAppList.value.find(
        app => app.clientId === selectedAuthApp.value!.clientId
    );
    if (originalApp) {
        selectedAuthApp.value = JSON.parse(JSON.stringify(originalApp));
    }
};
</script>

<template>
    <div class="flex flex-column sm:flex-row h-full w-full justify-content-center">
        <div class="col-12 sm:col-5 lg:col-4 xl:col-3 max-w-screen sm:max-w-20rem">
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
                            <div>
                                <div class="text-xl font-bold mb-1">{{ app.clientName }}</div>
                                <div class="text-sm text-color-secondary">{{ app.clientId }}</div>
                            </div>
                        </div>
                    </div>
                </ScrollPanel>
            </div>
        </div>
        <div v-if="selectedAuthApp" :style="{
    maxWidth: inSM ? 'none' : '90rem'
  }" class="col-12 sm:col-7 lg:col-8 xl:col-9 h-full">
            <div class="card h-full py-3">
                <TabView :pt="{
        panelContainer: 'flex min-h-0'
    }" :style="{
                    maxHeight: inSM ? 'none' : 'calc(100vh - 4rem)'
    }" class="flex flex-column h-full">
                    <TabPanel :pt="{
        content: 'grid w-full min-h-0 overflow-y-auto'
    }">
                        <template #header>
                            <div class="flex align-items-center gap-2">
                                <span class="font-bold white-space-nowrap">应用设置</span>
                            </div>
                        </template>
                        <!-- 基本信息 -->
                        <div class="col-12 text-xl text-800 font-bold">基本信息</div>
                        <div class="flex flex-column col-12 sm:col-6 xl:col-4 gap-2">
                            <label for="clientName">应用名称</label>
                            <InputText id="clientName" v-model="selectedAuthApp.clientName"
                                       :disabled="!enableClientEdit"/>
                        </div>
                        <div class="flex flex-column col-12 sm:col-6 xl:col-4 gap-2">
                            <label for="clientId">应用ID</label>
                            <InputText id="clientId" v-model="selectedAuthApp.clientId" :disabled="!enableClientEdit"/>
                        </div>
                        <div class="flex flex-column col-12 xl:col-8 gap-0 md:gap-2 py-3">
                            <div class="flex align-items-center justify-content-between mb-2">
                                <label for="clientId">应用密钥：</label>
                                <i v-if="enableClientEdit" v-tooltip.bottom="'这将随机生成新的密钥，请妥善保存。'"
                                   class="pi pi-refresh pl-1 md:pl-3 flex-shrink-0"/>
                            </div>
                            <Password id="clientSecret" v-model="selectedAuthApp.clientSecret" :disabled="!enableClientEdit"
                                      :pt="{
                                input: 'flex-1'
                            }" toggleMask type="text">
                                <template #content>
                                    <h6 class="pb-0 mb-0">{{ data.dataAnnotation }}</h6>
                                </template>
                            </Password>
                        </div>
                        <div class="col-12">
                            <div class="flex gap-3">
                                <div v-tooltip.bottom="isDirty? '有修改未保存' : ''">
                                    <Button
                                        :disabled="isDirty"
                                        :label="enableClientEdit ? '取消' : '修改'"
                                        icon="pi pi-pencil"
                                        @click="enableClientEdit = !enableClientEdit"
                                    />
                                </div>
                                <div v-tooltip.bottom="isDirty? '' : '内容未修改'">
                                    <Button
                                        v-if="enableClientEdit"
                                        :disabled="!isDirty"
                                        icon="pi pi-undo"
                                        label="重置"
                                        @click="revertChanges"
                                    />
                                </div>
                                <div v-tooltip.bottom="isDirty? '' : '内容未修改'">
                                    <Button
                                        v-if="enableClientEdit"
                                        :disabled="!isDirty"
                                        icon="pi pi-check"
                                        label="保存"
                                        severity="success"/>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <template #header>
                            <div class="flex align-items-center gap-2">
                                <span class="font-bold white-space-nowrap">授权设置</span>
                            </div>
                        </template>
                        <ScrollPanel class="h-full">
                        </ScrollPanel>
                    </TabPanel>
                    <TabPanel>
                        <template #header>
                            <div class="flex align-items-center gap-2">
                                <span class="font-bold white-space-nowrap">其他设置</span>
                            </div>
                        </template>
                        <ScrollPanel class="h-full">
                        </ScrollPanel>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>