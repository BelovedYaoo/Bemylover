<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import CustomDataTable from 'agility-core/src/components/CustomDataTable.vue';
import { DataTableRowReorderEvent } from 'primevue/datatable';
import { ColumnProps } from 'primevue/column';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { responseToastConfig } from '@/service/globalQuote';
import { useToast } from 'primevue/usetoast';
import { BaseFiled } from 'agility-core/src/types/base';

interface AuthorizedApplication extends BaseFiled {
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

// 字段列表
const filedList = ref<Array<ColumnProps>>([
    {field: 'clientName', header: '应用名称', style: 'width:10%;min-width:10rem;'},
    {field: 'clientId', header: '应用ID', style: 'width:10%;min-width:10rem;'},
    {field: 'clientSecret', header: '应用密钥', style: 'width:15%;min-width:10rem;'},
    {field: 'contractScopes', header: '签约的所有权限', style: 'width:15%;min-width:12rem;'},
    {field: 'allowRedirectUris', header: '允许授权的redirect_uri', style: 'width:15%;min-width:15rem;'},
    {field: 'allowGrantTypes', header: '允许的授权类型', style: 'width:15%;min-width:10rem;'},
]);

const toast = useToast();

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const tableData = ref<AuthorizedApplication[]>([]);
const dataInit = () => {
    request({
        url: '/authApp/queryAll',
        method: 'GET'
    }).then((response: AxiosResponse) => {
        tableData.value = response.data.data as Array<AuthorizedApplication>;
    });
};

// 删除逻辑
const onRowDelete = (records: AuthorizedApplication[]) => {
    request({
        url: '/authApp/delete',
        method: 'POST',
        data: records.map(r => r.baseId)
    }).then((response: AxiosResponse) => {
        toast.add(responseToastConfig(response));
        dataInit();
    });
};

// 行重新排序事件
const onRowReorder = (event: DataTableRowReorderEvent) => {
    const {dragIndex, dropIndex} = event;
    request({
        url: '/authApp/reorder',
        method: 'POST',
        params: {
            leftTarget: tableData.value[dragIndex].orderNum,
            rightTarget: tableData.value[dropIndex].orderNum
        }
    }).then((response: AxiosResponse) => {
        toast.add(responseToastConfig(response));
    });
    tableData.value = event.value;
};

// 刷新逻辑
const onTableDataRefresh = () => {
    dataInit();
};

// 顺序交换逻辑
const onOrderSwap = (swapRecords: AuthorizedApplication[]) => {
    request({
        url: '/authApp/orderSwap',
        method: 'POST',
        params: {
            leftTargetBaseId: swapRecords[0].baseId,
            leftTargetOrderNum: swapRecords[0].orderNum,
            rightTargetBaseId: swapRecords[1].baseId,
            rightTargetOrderNum: swapRecords[1].orderNum
        }
    }).then((response: AxiosResponse) => {
        toast.add(responseToastConfig(response));
        dataInit();
    });
};

// 修改或新增逻辑
const showInfoDialog = ref(false);
const recordInfo = ref<AuthorizedApplication>({});
const onRowUpdateOrAdd = (record: AuthorizedApplication) => {
    recordInfo.value = record;
    showInfoDialog.value = true;
};
const updateOrAdd = () => {
    request({
        url: `/authApp/${recordInfo.value?.baseId ? 'update' : 'add'}`,
        method: 'POST',
        data: recordInfo.value
    }).then((response: AxiosResponse) => {
        toast.add(responseToastConfig(response));
        dataInit();
        showInfoDialog.value = false;
    });
};

const allAuthGrantType = ref([
    {label: '授权码模式', value: 'authorization_code'},
    {label: '密码模式', value: 'password'},
    {label: '客户端模式', value: 'client_credentials'},
    {label: '简化模式', value: 'implicit'},
    {label: '刷新令牌模式', value: 'refresh_token'}
]);
</script>

<template>
    <div class="card">
        <CustomDataTable :on-order-swap="onOrderSwap"
                         :on-row-delete="onRowDelete"
                         :on-row-reorder="onRowReorder"
                         :on-row-update-or-add="onRowUpdateOrAdd"
                         :on-table-data-refresh="onTableDataRefresh"
                         :table-data="tableData"
                         table-name="授权应用">
            <template v-slot:column>
                <Column v-for="filed in filedList"
                        :key="filed.field"
                        :field="filed.field"
                        :header="filed.header"
                        :headerStyle="filed?.style"
                        :reorderableColumn="false"
                        sortable=""></Column>
            </template>
        </CustomDataTable>

        <Dialog v-model:visible="showInfoDialog" class="p-fluid min-w-min" modal style="max-width: 50rem">
            <template #header>
                <div class="p-dialog-title">{{ recordInfo?.baseId ? '修改' : '新增' }}数据</div>
            </template>
            <div class="grid">
                <div class="field col-12 sm:col-6 xl:col-4">
                    <label>应用名称</label>
                    <InputText
                        id="clientName"
                        v-model="recordInfo.clientName"
                    />
                </div>
                <div class="field col-12 sm:col-6 xl:col-4">
                    <label>应用ID</label>
                    <InputText
                        id="clientId"
                        v-model="recordInfo.clientId"
                    />
                </div>
                <div class="field col-12 sm:col-6 xl:col-4">
                    <label>签约权限</label>
                    <InputText
                        id="contractScopes"
                        v-model="recordInfo.contractScopes"
                    />
                </div>
                <div class="field col-12 sm:col-6">
                    <label>应用密钥</label>
                    <InputText
                        id="clientSecret"
                        v-model="recordInfo.clientSecret"
                    />
                </div>
                <div class="field col-12 sm:col-6">
                    <label>刷新 Refresh-Token</label>
                    <ToggleButton id="isNewRefresh" v-model="recordInfo.isNewRefresh"/>
                </div>
                <div class="field col-12 sm:col-6">
                    <label>授权回调</label>
                    <InputText
                        id="allowRedirectUris"
                        v-model="recordInfo.allowRedirectUris"
                    />
                </div>
                <div class="field col-12">
                    <label>授权类型</label>
                    <div class="flex flex-row gap-3">
                        <div v-for="authGrantType of allAuthGrantType" :key="authGrantType.key"
                             class="flex align-items-center">
                            <Checkbox v-model="recordInfo.allowGrantTypes" :inputId="authGrantType.key"
                                      :name="authGrantType.value"
                                      :value="authGrantType.value"/>
                            <label class="pl-2 align-self-baseline">{{ authGrantType.label }}</label>
                        </div>
                    </div>
                </div>
                <div class="field col-12 sm:col-6">
                    <label>Access-Token-Timeout</label>
                    <InputText
                        id="accessTokenTimeout"
                        v-model="recordInfo.accessTokenTimeout"
                    />
                </div>
                <div class="field col-12 sm:col-6">
                    <label>Refresh-Token-Timeout</label>
                    <InputText
                        id="refreshTokenTimeout"
                        v-model="recordInfo.refreshTokenTimeout"
                    />
                </div>
                <div class="field col-12 sm:col-6">
                    <label>Client-Token-Timeout</label>
                    <InputText
                        id="clientTokenTimeout"
                        v-model="recordInfo.clientTokenTimeout"
                    />
                </div>
                <div class="field col-12 sm:col-6">
                    <label>Lower-Client-Token-Timeout</label>
                    <InputText
                        id="lowerClientTokenTimeout"
                        v-model="recordInfo.lowerClientTokenTimeout"
                    />
                </div>
            </div>
            <template #footer>
                <div class="flex">
                    <div class="flex ml-auto justify-content-end">
                        <Button
                            class="p-button-text"
                            icon="pi pi-times"
                            label="返回"
                            @click="showInfoDialog = false"
                        />
                        <Button
                            class="p-button-text m-0"
                            icon="pi pi-check"
                            label="保存修改"
                            @click="updateOrAdd"
                        />
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
</style>