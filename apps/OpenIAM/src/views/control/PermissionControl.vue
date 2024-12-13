<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import CustomDataTable from 'agility-core/src/components/CustomDataTable.vue';
import { DataTableRowReorderEvent } from 'primevue/datatable';
import { ColumnProps } from 'primevue/column';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { responseToastConfig } from 'agility-core/src/service/toolkit';
import { useToast } from 'primevue/usetoast';
import { Permission } from '@/typing/types/type';

const toast = useToast();

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const tableData = ref<Permission[]>([]);
const dataInit = () => {
    request({
        url: '/permission/queryAll',
        method: 'GET'
    }).then((response: AxiosResponse) => {
        tableData.value = response.data.data as Array<Permission>;
    });
};

// 删除逻辑
const onRowDelete = (records: Permission[]) => {
    request({
        url: '/permission/delete',
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
        url: '/permission/reorder',
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
const onOrderSwap = (swapRecords: Permission[]) => {
    request({
        url: '/permission/orderSwap',
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
const recordInfo = ref<Permission>({});
const onRowUpdateOrAdd = (record: Permission) => {
    recordInfo.value = record;
    showInfoDialog.value = true;
};
const updateOrAdd = () => {
    request({
        url: `/permission/${recordInfo.value?.baseId ? 'update' : 'add'}`,
        method: 'POST',
        data: recordInfo.value
    }).then((response: AxiosResponse) => {
        toast.add(responseToastConfig(response));
        dataInit();
        showInfoDialog.value = false;
    });
};

// 字段列表
const filedList = ref<Array<ColumnProps>>([
    {field: 'permissionName', header: '权限名称', style: 'width:20%;min-width:10rem;'},
    {field: 'permissionCode', header: '权限代码', style: 'width:20%;min-width:10rem;'},
    {field: 'permissionDesc', header: '权限描述', style: 'width:20%;min-width:10rem;'},
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
                         table-name="权限">
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

        <Dialog v-model:visible="showInfoDialog" class="p-fluid w-3" modal>
            <template #header>
                <div class="p-dialog-title">{{ recordInfo?.baseId ? '修改' : '新增' }}数据</div>
            </template>
            <div class="field">
                <label>权限名称</label>
                <InputText
                    id="PermissionName"
                    v-model="recordInfo.permissionName"
                />
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label>权限代码</label>
                    <InputText
                        id="PermissionCode"
                        v-model="recordInfo.permissionCode"
                    />
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label>权限描述</label>
                    <InputText
                        id="PermissionDesc"
                        v-model="recordInfo.permissionDesc"
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