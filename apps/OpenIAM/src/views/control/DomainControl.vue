<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { del, queryAll, update } from '@/service/request';
import { IDomain } from 'agility-core/src/types/OpenAC';
import { StoreStateInterface, useAgilityCoreStore } from 'agility-core/src/service/store';
import { responseToastConfig, Tree2TreeNode } from 'agility-core/src/service/toolkit';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { ITreeNode } from 'agility-core/src/types/core';

const store = useAgilityCoreStore();
const toast = useToast();
const confirm = useConfirm();

const {inMD} = storeToRefs<StoreStateInterface>(store);

const originalDataList = ref<IDomain[]>([]);
const dataList = ref<ITreeNode<IDomain>[]>([]);
const selectedData = ref<IDomain | null>(null);
const searchQuery = ref('');
const enableEdit = ref(false);
const isSaving = ref(false);
const selectedKey = ref(null);
const tree = ref(null);

watch(searchQuery, (newValue) => {
    tree.value.filterValue = newValue;
});

onMounted(() => {
    dataInit().then(() => {
        if (dataList.value.length > 0) {
            selectDataByKey(dataList.value[0].key);
        }
    });
});

// 数据初始化
const dataInit = async (): Promise<void> => {
    return queryAll<IDomain>('domain').then(response => {
        originalDataList.value = response.data.data;
        dataList.value = Tree2TreeNode<IDomain>(originalDataList.value, 'domainName');
    }).catch(error => {
        console.error('数据加载失败:', error);
    });
};

// 选中数据
const selectData = (data?: ITreeNode<IDomain>) => {
    selectDataByKey(data?.key);
};

// 根据key选中数据
const selectDataByKey = (key: string) => {
    const node = originalDataList.value.find(node => node.baseId === key);
    if (node) {
        selectedData.value = JSON.parse(JSON.stringify(node));
    }
};

// 判断是否需要显示重置按钮
const isDirty = computed(() => {
    if (!selectedData.value) return false;
    const original = originalDataList.value.find(a => a.baseId === selectedData.value.baseId);
    return JSON.stringify(original) !== JSON.stringify(selectedData.value);
});

// 重置数据
const revertChanges = () => {
    if (!selectedData.value) return;
    // 从原始数据中恢复当前选中项
    const originalData = dataList.value.find(
        data => data.key === selectedData.value!.baseId
    );
    if (originalData) {
        selectedData.value = JSON.parse(JSON.stringify(originalData));
    }
};

const handleSave = async () => {
    if (!selectedData.value || !isDirty.value) return;
    isSaving.value = true;
    update<IDomain>('domain', selectedData.value)
        .success(response => {
            dataInit().then(() => {
                selectDataByKey(selectedData.value!.baseId);
            });
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

const handleDelete = (event) => {
    confirm.require({
        target: event.currentTarget,
        group: 'default',
        header: '你确认要删除吗?',
        message: '这将会删除包括子域在内的所有数据!!!',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-sm',
        rejectClass: '',
        acceptLabel: '取消',
        rejectLabel: '确认',
        accept: () => {
        },
        reject: () => {
            del('domain', [selectedData.value!.baseId]).then(response => {
                toast.add(responseToastConfig(response));
                dataInit().then(() => {
                    selectDataByKey(selectedData.value!.parentId);
                });
            });
        }
    });
};
</script>

<template>
    <div class="flex flex-column md:flex-row h-full w-full justify-content-center">
        <div class="col-12 md:col-4 xl:col-3 max-w-screen md:max-w-25rem">
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
                            v-tooltip.bottom="'新增节点'"
                            class="p-button-primary white-space-nowrap"
                            icon="pi pi-plus"
                        />
                    </div>
                </div>
                <ScrollPanel class="h-full min-h-0">
                    <Tree ref="tree" v-model:selectionKeys="selectedKey" :value="dataList" class="p-0 border-0"
                          filterMode="strict"
                          selectionMode="single" @nodeSelect="selectData"/>
                </ScrollPanel>
            </div>
        </div>
        <div :style="{
    maxWidth: inMD ? 'none' : '90rem'
  }" class="col-12 md:col-8 xl:col-9 h-full">
            <div class="card h-full py-3">
                <TabView v-if="selectedData" :pt="{
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
                        <div class="flex flex-column col-12 sm:col-6 xl:col-4 gap-2">
                            <label for="domainName">域名称</label>
                            <InputText id="domainName" v-model="selectedData.domainName"
                                       :disabled="!enableEdit"/>
                        </div>
                        <div class="flex flex-column col-12 sm:col-6 xl:col-4 gap-2">
                            <label for="domainCode">域代码</label>
                            <InputText id="domainCode" v-model="selectedData.domainCode" :disabled="!enableEdit"/>
                        </div>
                        <div class="flex flex-column col-12 xl:col-8 gap-2">
                            <label for="domainDesc">域描述</label>
                            <InputText id="domainDesc" v-model="selectedData.domainDesc" :disabled="!enableEdit"/>
                        </div>
                        <div class="col-12 pt-4">
                            <div class="flex gap-3">
                                <div v-tooltip.bottom="isDirty? '有修改未保存' : ''">
                                    <Button
                                        :disabled="isDirty"
                                        :label="enableEdit ? '取消' : '修改'"
                                        icon="pi pi-pencil"
                                        @click="enableEdit = !enableEdit"
                                    />
                                </div>
                                <div v-if="enableEdit" v-tooltip.bottom="isDirty? '撤销所有修改' : '内容未修改'">
                                    <Button
                                        :disabled="!isDirty"
                                        icon="pi pi-undo"
                                        label="重置"
                                        severity="secondary"
                                        @click="revertChanges"
                                    />
                                </div>
                                <div v-if="enableEdit" v-tooltip.bottom="isDirty? '' : '内容未修改'">
                                    <Button
                                        :disabled="!isDirty || isSaving"
                                        :icon="isSaving ? 'pi pi-spinner pi-spin' : 'pi pi-check'"
                                        :label="isSaving ? '保存中...' : '保存'"
                                        severity="success"
                                        @click="handleSave"/>
                                </div>
                                <div>
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
</template>

<style scoped>
</style>