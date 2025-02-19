<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { add, del, queryAll, update } from '@/service/request';
import { IBaseFiled } from 'agility-core/src/types/base';
import { StoreStateInterface, useAgilityCoreStore } from 'agility-core/src/service/store';
import { addClassById, isNotValid, responseToastConfig } from 'agility-core/src/service/toolkit';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

interface IAuthApp extends IBaseFiled {
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
const {inMD} = storeToRefs<StoreStateInterface>(store);
const isSaving = ref(false);
const toast = useToast();
const showAddDialog = ref(false);
const addApp = ref<IAuthApp>({});

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
    queryAll<IAuthApp>('authApp').then(response => {
        authAppList.value = response.data.data;
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

const generateRandomSecret = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';
    const crypto = window.crypto || (window as any).msCrypto;
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    return Array.from(values)
        .map(x => chars[x % chars.length])
        .join('');
};

const generateNewSecret = () => {
    if (!selectedAuthApp.value) return;
    selectedAuthApp.value.clientSecret = generateRandomSecret();
};

const handleUpdate = async () => {
    if (!selectedAuthApp.value || !isDirty.value) return;
    isSaving.value = true;
    update<IAuthApp>('authApp', selectedAuthApp.value)
        .success(response => {
            // 更新本地数据
            const index = authAppList.value.findIndex(a => a.clientId === selectedAuthApp.value!.clientId);
            if (index !== -1) {
                authAppList.value[index] = {...selectedAuthApp.value};
            }
            toast.add(responseToastConfig(response));
        })
        .failed(response => {
            throw new Error(response.data.description || '未知错误');
        })
        .catch(error => {
            toast.add({
                severity: 'error',
                summary: '保存失败',
                detail: error.response?.data?.description || error.message || '请求处理失败',
                life: 5000
            });
        })
        .finally(() => {
            isSaving.value = false;
        });
};

const handleAdd = () => {
    if (isNotValid(addApp.value.clientName)) {
        addClassById('addClientName', 'p-invalid', 3);
        toast.add({
            severity: 'error',
            summary: '添加失败',
            detail: '请输入应用名称',
            life: 3000
        });
        return;
    }
    if (isNotValid(addApp.value.clientId)) {
        addClassById('addClientId', 'p-invalid', 3);
        toast.add({
            severity: 'error',
            summary: '添加失败',
            detail: '请输入应用ID',
            life: 3000
        });
        return;
    }
    add<IAuthApp>('authApp', addApp.value)
        .success(response => {
            dataInit();
            toast.add(responseToastConfig(response));
            showAddDialog.value = false;
        })
        .failed(response => {
            throw new Error(response.data.description || '未知错误');
        })
        .catch(error => {
            toast.add({
                severity: 'error',
                summary: '保存失败',
                detail: error.response?.data?.description || error.message || '请求处理失败',
                life: 5000
            });
        });
};

const handleDelete = () => {
    del('authApp', [selectedAuthApp.value.baseId])
        .success(response => {
            dataInit();
            toast.add(responseToastConfig(response));
        })
        .failed(response => {
            throw new Error(response.data.description || '未知错误');
        });
};
</script>

<template>
    <div class="flex flex-column md:flex-row h-full w-full justify-content-center">
        <div class="col-12 md:col-4 xl:col-3 max-w-screen md:max-w-20rem">
            <div class="card flex flex-column max-h-30rem md:max-h-full md:h-full">
                <div class="flex flex-column md:flex-row">
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
                            @click="showAddDialog = true"
                        />
                    </div>
                </div>
                <ScrollPanel class="h-full min-h-0">
                    <div class="app-list">
                        <div
                            v-for="app in filteredApps"
                            :key="app.clientId"
                            class="app-item py-2 sm:py-3 cursor-pointer border-round flex gap-3"
                            @click="selectApp(app)"
                        >
                            <div>
                                <div :class="{ 'text-primary': selectedAuthApp?.clientId === app.clientId }"
                                     class="text-xl font-bold mb-1">{{ app.clientName }}
                                </div>
                                <div class="text-sm text-color-secondary">{{ app.clientId }}</div>
                            </div>
                        </div>
                    </div>
                </ScrollPanel>
            </div>
        </div>
        <div :style="{
    maxWidth: inMD ? 'none' : '90rem'
  }" class="col-12 md:col-8 xl:col-9 h-full">
            <div class="card h-full py-3">
                <TabView v-if="selectedAuthApp" :pt="{
        panelContainer: 'flex min-h-0'
    }" :style="{
                    maxHeight: inMD ? 'none' : 'calc(100vh - 4rem)'
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
                        <div class="flex flex-column col-12 xl:col-8 py-2">
                            <div class="flex align-items-center justify-content-between mb-2">
                                <label for="clientId">应用密钥</label>
                                <i v-if="enableClientEdit"
                                   v-tooltip.bottom="'这将随机生成新的密钥，但并不会立即保存。'"
                                   class="pi pi-refresh pr-2 flex-shrink-0"
                                   @click="generateNewSecret"/>
                            </div>
                            <Password id="clientSecret" v-model="selectedAuthApp.clientSecret"
                                      :disabled="!enableClientEdit"
                                      :pt="{
                                input: 'flex-1'
                            }" toggleMask type="text">
                                <template #content>
                                    <h6 class="pb-0 mb-0">应用密钥为识别应用身份的重要凭据，请妥善保存。</h6>
                                </template>
                            </Password>
                        </div>
                        <div class="col-12 pt-4">
                            <div class="flex gap-3">
                                <div v-tooltip.bottom="isDirty? '有修改未保存' : ''">
                                    <Button
                                        :disabled="isDirty"
                                        :label="enableClientEdit ? '取消' : '修改'"
                                        icon="pi pi-pencil"
                                        @click="enableClientEdit = !enableClientEdit"
                                    />
                                </div>
                                <div v-if="enableClientEdit" v-tooltip.bottom="isDirty? '撤销所有修改' : '内容未修改'">
                                    <Button
                                        :disabled="!isDirty"
                                        icon="pi pi-undo"
                                        label="重置"
                                        severity="secondary"
                                        @click="revertChanges"
                                    />
                                </div>
                                <div v-if="enableClientEdit" v-tooltip.bottom="isDirty? '' : '内容未修改'">
                                    <Button
                                        :disabled="!isDirty || isSaving"
                                        :icon="isSaving ? 'pi pi-spinner pi-spin' : 'pi pi-check'"
                                        :label="isSaving ? '保存中...' : '保存'"
                                        severity="success"
                                        @click="handleUpdate"/>
                                </div>
                                <div v-tooltip.bottom="'连同域也会一起删除！'">
                                    <Button
                                        icon="pi pi-trash"
                                        label="删除"
                                        severity="danger"
                                        @click="handleDelete"/>
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
    <Dialog v-model:visible="showAddDialog" class="p-fluid max-w-30rem min-w-min" modal>
        <template #header>
            <div class="p-dialog-title">新增应用</div>
        </template>
        <div class="field col">
            <label>应用名称</label>
            <InputText
                id="addClientName"
                v-model="addApp.clientName"
            />
        </div>
        <div class="field col">
            <label>应用ID</label>
            <InputText
                id="addClientId"
                v-model="addApp.clientId"
            />
            <small id="clientId-help">其他参数可稍后自行设置,新增时不需要输入.</small>
        </div>
        <template #footer>
            <div class="flex">
                <div class="flex ml-auto justify-content-end">
                    <Button
                        class="p-button-text"
                        icon="pi pi-times"
                        label="取消"
                        @click="showAddDialog = false"
                    />
                    <Button
                        class="p-button-text m-0"
                        icon="pi pi-check"
                        label="确认"
                        @click="handleAdd"
                    />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
</style>