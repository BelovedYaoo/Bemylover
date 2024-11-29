<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { useToast } from 'primevue/usetoast';
import { BaseTenantFiled } from 'agility-core/src/types/base';
import EnterpriseInput from '@/components/EnterpriseInput.vue';

interface EnterpriseConfig extends BaseTenantFiled {
    corpId: string;
    agentId: string;
    secret: string;
    amapKey: string;
    tianApiKey: string;
    dataSources: string;
    departmentId: string;
    pushMode: string;
    weatherValue: string;
    imgUrl: string;
    url: string;
    dateStarting: string;
    dateEnding: string;
    classDays: string;
    morningClassDays: string;
    totalClassTimes: string;
    totalSpecializedClassTimes: string;
    nightClassDays: string;
    debugPushMode: string;
    debugPeriod: string;
    debugUser: string;
    debugWeek: string;
    isEnabledPush: string;
    pushCorn: string;
}

const toast = useToast();

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const enterpriseConfigData = ref<EnterpriseConfig>({});
const dataInit = () => {
    request({
        url: '/enterpriseConfig/queryAll',
        method: 'GET'
    }).then((response: AxiosResponse) => {
        enterpriseConfigData.value = response.data.data[0] as EnterpriseConfig;
    });
};

const updateDataValue = (name: keyof EnterpriseConfig, value: string) => {
    enterpriseConfigData.value[name] = value;
};

const duPush = () => {
    request({
        url: '/pushCourse',
        method: 'GET',
        data: enterpriseConfigData.value
    }).then((response: AxiosResponse) => {
        console.log(response);
    });
};

const reset = () => {
    request({
        url: '/resetCurriculumData',
        method: 'GET',
        data: enterpriseConfigData.value
    }).then((response: AxiosResponse) => {
        console.log(response);
    });
};

const saveData = () => {
    request({
        url: '/enterpriseConfig/update',
        method: 'POST',
        data: enterpriseConfigData.value
    }).then((response: AxiosResponse) => {
        console.log(response);
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-6">
            <Toast/>
            <div class="card p-fluid">
                <h5>API配置</h5>
                <div class="formgrid grid">
                    <EnterpriseInput v-model:data-value="enterpriseConfigData.tianApiKey" :is-enc="true"
                                     data-desc="天行数据api密钥(此参数为密钥，请保密)" data-name="tianApiKey"
                                     @update:dataValue="(value) => updateDataValue('tianApiKey', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.amapKey" :is-enc="true"
                                     data-desc="高德地图天气api密钥(此参数为密钥，请保密)" data-name="amapKey"
                                     @update:dataValue="(value) => updateDataValue('amapKey', value)"/>
                </div>
            </div>

            <div class="card p-fluid">
                <h5>调试数据</h5>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.debugPeriod"
                                     data-desc="调试周期(如不启用调试，请置空)"
                                     data-name="debugPeriod"
                                     @update:dataValue="(value) => updateDataValue('debugPeriod', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.debugWeek"
                                     data-desc="调试星期(如不启用调试，请置空)"
                                     data-name="debugWeek"
                                     @update:dataValue="(value) => updateDataValue('debugWeek', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.debugPushMode"
                                     data-desc="调试模式下的部门推送ID，使用此推送部门ID时，不会将课程计入次数"
                                     data-name="debugPushMode"
                                     @update:dataValue="(value) => updateDataValue('debugPushMode', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.debugUser" data-desc="当推送异常时，将提示此用户"
                                     data-name="debugUser"
                                     @update:dataValue="(value) => updateDataValue('debugUser', value)"/>
                </div>
            </div>

            <div class="card p-fluid">
                <h5>统计数据</h5>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.classDays" data-desc="累计上课天数(此项不可为空)"
                                     data-name="classDays"
                                     @update:dataValue="(value) => updateDataValue('classDays', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.morningClassDays"
                                     data-desc="累计早课天数(此项不可为空)"
                                     data-name="morningClassDays"
                                     @update:dataValue="(value) => updateDataValue('morningClassDays', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.nightClassDays"
                                     data-desc="累计晚课天数(此项不可为空)"
                                     data-name="nightClassDays"
                                     @update:dataValue="(value) => updateDataValue('nightClassDays', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.totalClassTimes"
                                     data-desc="累计课程次数(此项不可为空)"
                                     data-name="totalClassTimes"
                                     @update:dataValue="(value) => updateDataValue('totalClassTimes', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.totalSpecializedClassTimes"
                                     data-desc="累计专业课程次数(此项不可为空)"
                                     data-name="totalSpecializedClassTimes"
                                     @update:dataValue="(value) => updateDataValue('totalSpecializedClassTimes', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.dateStarting" data-desc="开学日期"
                                     data-name="dateStarting"
                                     @update:dataValue="(value) => updateDataValue('dateStarting', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.dateEnding" data-desc="放假日期"
                                     data-name="dateEnding"
                                     @update:dataValue="(value) => updateDataValue('dateEnding', value)"/>
                </div>
            </div>
        </div>

        <div class="col-12 md:col-6">
            <div class="card p-fluid">
                <h5>企业微信</h5>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.corpId" :is-enc="true"
                                     data-desc="企业id(此参数为身份唯一标识，请保密)" data-name="corpId"
                                     @update:dataValue="(value) => updateDataValue('corpId', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.agentId" :is-enc="true"
                                     data-desc="自建应用id(此参数为身份唯一标识，请保密)" data-name="agentId"
                                     @update:dataValue="(value) => updateDataValue('agentId', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.secret" :is-enc="true"
                                     data-desc="自建应用secret(此参数为密钥，请保密)" data-name="secret"
                                     @update:dataValue="(value) => updateDataValue('secret', value)"/>
                </div>
            </div>

            <div class="card p-fluid">
                <h5>推送数据</h5>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.departmentId"
                                     data-desc="推送部门ID(此参数用于控制被推送的部门)"
                                     data-name="departmentId"
                                     @update:dataValue="(value) => updateDataValue('departmentId', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.pushMode"
                                     data-desc="推送时间(为 0 则每日早晨推送当日课程与天气，为 1 则每日夜间推送明日课程与天气)"
                                     data-name="pushMode"
                                     @update:dataValue="(value) => updateDataValue('pushMode', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.dataSources"
                                     data-desc="天气数据来源(为 0 则使用高德数据，为 1 则使用天行数据)"
                                     data-name="dataSources"
                                     @update:dataValue="(value) => updateDataValue('dataSources', value)"/>
                </div>
                <div class="formgrid grid">
                    <EnterpriseInput :data-value="enterpriseConfigData.url" data-desc="卡片消息的跳转url"
                                     data-name="url"
                                     @update:dataValue="(value) => updateDataValue('url', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.imgUrl" data-desc="图文消息的图片url"
                                     data-name="imgUrl"
                                     @update:dataValue="(value) => updateDataValue('imgUrl', value)"/>
                    <EnterpriseInput :data-value="enterpriseConfigData.weatherValue"
                                     data-desc="天气推送位置(使用城市编码，也就是身份证的前6位)"
                                     data-name="weatherValue"
                                     @update:dataValue="(value) => updateDataValue('weatherValue', value)"/>

                </div>
            </div>

            <div class="card p-fluid flex justify-content-center">
                <EnterpriseInput :data-value="enterpriseConfigData.isEnabledPush"
                                     data-desc="是否开启推送任务"
                                     data-name="isEnabledPush"
                                     @update:dataValue="(value) => updateDataValue('isEnabledPush', value)"/>
                <EnterpriseInput :data-value="enterpriseConfigData.pushCorn"
                                     data-desc="推送任务corn表达式"
                                     data-name="pushCorn"
                                     @update:dataValue="(value) => updateDataValue('pushCorn', value)"/>
            </div>

            <div class="card p-fluid flex justify-content-center">
                <Button
                    class="p-button-danger mr-2"
                    icon="pi pi-trash"
                    label="立即推送"
                    @click="duPush"
                />
                <Button
                    class="p-button-info mr-2"
                    icon="pi pi-download"
                    label="重置线性课表"
                    @click="reset"
                />
                <Button
                    class="p-button-help mr-2"
                    icon="pi pi-upload"
                    label="导出到CSV"
                />
                <Button
                    class="p-button-success mr-2"
                    icon="pi pi-check"
                    label="确认修改"
                    @click="saveData()"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>