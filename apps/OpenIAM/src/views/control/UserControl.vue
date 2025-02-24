<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import CustomDataTable from 'agility-core/src/components/CustomDataTable.vue';
import { DataTableRowReorderEvent } from 'primevue/datatable';
import { ColumnProps } from 'primevue/column';
import { del, orderSwap, queryAll, reorder, request } from '@/service/request';
import { AxiosResponse } from 'axios';
import { responseToastConfig } from 'agility-core/src/service/toolkit';
import { useToast } from 'primevue/usetoast';
import { IUser } from '@/typing/types/type';
import { sha256 } from 'hash.js';

const toast = useToast();

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const tableData = ref<IUser[]>([]);
const dataInit = () => {
    queryAll<IUser>('user').then(response => {
        tableData.value = response.data.data;
    });
};

// 删除逻辑
const onRowDelete = (records: IUser[]) => {
    del('user', records.map(r => r.baseId)).then(response => {
        toast.add(responseToastConfig(response));
        dataInit();
    });
};

// 行重新排序事件
const onRowReorder = (event: DataTableRowReorderEvent) => {
    const {dragIndex, dropIndex} = event;
    reorder('user', tableData.value[dragIndex].orderNum, tableData.value[dropIndex].orderNum)
        .then((response: AxiosResponse) => {
            toast.add(responseToastConfig(response));
            dataInit();
        });
    tableData.value = event.value;
};

// 刷新逻辑
const onTableDataRefresh = () => {
    dataInit();
};

// 顺序交换逻辑
const onOrderSwap = (swapRecords: IUser[]) => {
    orderSwap('user', swapRecords[0].baseId, swapRecords[0].orderNum, swapRecords[1].baseId, swapRecords[1].orderNum)
        .then((response: AxiosResponse) => {
            toast.add(responseToastConfig(response));
            dataInit();
        });
};

// 修改或新增逻辑
const showInfoDialog = ref(false);
const recordInfo = ref<IUser>({});
const onRowUpdateOrAdd = (record: IUser) => {
    recordInfo.value = record;
    showInfoDialog.value = true;
};
const updateOrAdd = () => {
    recordInfo.value.password = btoa(sha256().update(recordInfo.value.password).digest('hex'));
    request({
        url: `/user/${recordInfo.value?.baseId ? 'update' : 'add'}`,
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
    {field: 'openId', header: 'OpenID', style: 'width:20%;min-width:10rem;'},
    {field: 'phone', header: '手机号', style: 'width:20%;min-width:10rem;'},
    {field: 'email', header: '邮箱', style: 'width:20%;min-width:10rem;'},
    {field: 'nickname', header: '昵称', style: 'width:10%;min-width:7rem;'},
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
                         table-name="账户">
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
                <label>昵称</label>
                <InputText
                    id="nickname"
                    v-model="recordInfo.nickname"
                    integeronly
                />
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label>Open ID</label>
                    <InputText
                        id="phone"
                        v-model="recordInfo.openId"
                        integeronly
                    />
                </div>
                <div class="field col">
                    <label class="text-600 font-bold ml-1" for="password">密码</label>
                    <Password id="password" v-model="recordInfo.password" :toggleMask="true"
                              class="w-full" inputClass="w-full font-bold" mediumLabel="适中"
                              prompt-label="输入您的密码" strongLabel="安全" weakLabel="过于简单">
                        <template #header>
                            <label class="text-600 font-bold pb-2">我们不会存储您的明文密码</label>
                            <br/>
                            <label class="text-600 font-bold">您的密码将在本地经过加密与二次编码后上传</label>
                        </template>
                        <template #footer>
                            <Divider class="my-2"/>
                            <p class="mb-0">密码建议</p>
                            <ul class="pl-3 ml-2 mt-2 mb-0" style="line-height: 1.5">
                                <li>至少一个小写字母</li>
                                <li>至少一个大写字母</li>
                                <li>至少一个数字</li>
                                <li>最小8个字符</li>
                            </ul>
                        </template>
                    </Password>
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label>手机号</label>
                    <InputText
                        id="phone"
                        v-model="recordInfo.phone"
                        integeronly
                    />
                </div>
                <div class="field col">
                    <label>邮箱</label>
                    <InputText
                        id="email"
                        v-model="recordInfo.email"
                        integeronly
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