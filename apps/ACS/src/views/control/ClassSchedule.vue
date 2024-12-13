<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import CustomDataTable from 'agility-core/src/components/CustomDataTable.vue';
import { DataTableRowReorderEvent } from 'primevue/datatable';
import { ColumnProps } from 'primevue/column';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { responseToastConfig } from 'agility-core/src/service/toolkit';
import { useToast } from 'primevue/usetoast';
import { BaseTenantFiled } from 'agility-core/src/types/base';

interface ClassSchedule extends BaseTenantFiled {
    courseName: string;
    courseVenue: number;
    courseType: string;
    schedulePeriod: string;
    scheduleWeek: string;
    scheduleSection: string;
}

// 字段列表
const filedList = ref<Array<ColumnProps>>([
    {field: 'courseName', header: '课程名称', style: 'width:20%;min-width:10rem;'},
    {field: 'courseVenue', header: '上课地点', style: 'width:20%;min-width:10rem;'},
    {field: 'courseType', header: '课程类型', style: 'width:20%;min-width:10rem;'},
    {field: 'schedulePeriod', header: '课程周期', style: 'width:10%;min-width:7rem;'},
    {field: 'scheduleWeek', header: '课程星期', style: 'width:10%;min-width:7rem;'},
    {field: 'scheduleSection', header: '课程节次', style: 'width:10%;min-width:7rem;'},
]);

const toast = useToast();

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const tableData = ref<ClassSchedule[]>([]);
const dataInit = () => {
    request({
        url: '/classSchedule/queryAll',
        method: 'GET'
    }).then((response: AxiosResponse) => {
        tableData.value = response.data.data as Array<ClassSchedule>;
    });
};

// 删除逻辑
const onRowDelete = (records: ClassSchedule[]) => {
    request({
        url: '/classSchedule/delete',
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
        url: '/classSchedule/reorder',
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
const onOrderSwap = (swapRecords: ClassSchedule[]) => {
    request({
        url: '/classSchedule/orderSwap',
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
const recordInfo = ref<ClassSchedule>({});
const onRowUpdateOrAdd = (record: ClassSchedule) => {
    recordInfo.value = record;
    showInfoDialog.value = true;
};
const updateOrAdd = () => {
    request({
        url: `/classSchedule/${recordInfo.value?.baseId?'update':'add'}`,
        method: 'POST',
        data: recordInfo.value
    }).then((response: AxiosResponse) => {
        toast.add(responseToastConfig(response));
        dataInit();
        showInfoDialog.value = false;
    });
};

</script>

<template>
    <div class="card">
        <CustomDataTable :on-order-swap="onOrderSwap"
                         :on-row-delete="onRowDelete"
                         :on-row-update-or-add="onRowUpdateOrAdd"
                         :on-row-reorder="onRowReorder"
                         :on-table-data-refresh="onTableDataRefresh"
                         :table-data="tableData"
                         table-name="课程表">
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

        <Dialog v-model:visible="showInfoDialog" modal class="p-fluid max-w-30rem min-w-min">
            <template #header>
                <div class="p-dialog-title">{{ recordInfo?.baseId ? '修改' : '新增' }}数据</div>
            </template>
            <div class="field">
                <label>课程名称</label>
                <InputText
                    id="courseName"
                    v-model="recordInfo.courseName"
                />
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label>上课地点</label>
                    <InputText
                        id="courseVenue"
                        v-model="recordInfo.courseVenue"
                    />
                </div>
                <div class="field col">
                    <label>课程类型</label>
                    <InputText
                        id="courseType"
                        v-model="recordInfo.courseType"
                    />
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label>课程周期</label>
                    <InputText
                        id="schedulePeriod"
                        v-model="recordInfo.schedulePeriod"
                    />
                </div>
                <div class="field col">
                    <label>课程星期</label>
                    <InputText
                        id="scheduleWeek"
                        v-model="recordInfo.scheduleWeek"
                    />
                </div>
                <div class="field col">
                    <label>课程节次</label>
                    <InputText
                        id="scheduleSection"
                        v-model="recordInfo.scheduleSection"
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