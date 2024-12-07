<script lang="ts" setup>
import AppTopbar from 'agility-core/src/layout/AppTopbar.vue';
import { globalConfig, signOut } from '@/service/globalQuote';
import { ref } from 'vue';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const confirm = useConfirm();
const toast = useToast();

const requireConfirmation = () => {
    confirm.require({
        group: 'headless',
        header: '确认要退出吗？',
        message: '您的会话将从所有系统下线',
        accept: () => {
            toast.add({severity: 'info', summary: '操作已确认', detail: '您已下线', life: 3000});
            signOut();
        },
        reject: () => {
        }
    });
};
const avatarSidebar = ref(false);
</script>

<template>
    <AppTopbar :app-name="globalConfig.appName">
        <template #appIcon>
            <img alt="logo" src="/images/logo.svg"/>
        </template>
        <template #topbarMenu>
            <Button class="m-0 p-0 layout-menu-button topbar-button" icon="pi pi-bookmark" rounded
                    severity="secondary" size="large" text/>
            <Button class="m-0 p-0 layout-menu-button topbar-button" icon="pi pi-search" rounded
                    severity="success" size="large" text/>
            <Avatar image="https://avatars.githubusercontent.com/u/103827252?v=4" shape="circle"
                    size="large" style="background-color: #ece9fc; color: #2a1261" @click="avatarSidebar = true"/>
        </template>
    </AppTopbar>
    <Sidebar v-model:visible="avatarSidebar" :pt="{
        headerContent: { class: 'w-full justify-content-between' }
    }" :showCloseIcon="false" class="w-16rem md:w-20rem" position="right">
        <template #header>
            <div class="flex">
                <span
                    class="text-700 font-bold align-content-center w-full white-space-nowrap overflow-hidden text-overflow-ellipsis">个人信息</span>
                <button class="p-sidebar-icon p-link mr-2">
                    <span class="pi pi-cog"/>
                </button>
                <button class="p-sidebar-icon p-link mr-2" @click="requireConfirmation">
                    <span class="pi pi-sign-out"/>
                </button>
            </div>
        </template>
        <!-- 个人信息 -->
        <div class="flex flex-column align-items-center">
            <Avatar class="w-8rem h-8rem" image="https://avatars.githubusercontent.com/u/103827252?v=4" shape="circle"
                    size="large" style="background-color: #ece9fc; color: #2a1261" @click="avatarSidebar = true"/>
            <span
                class="text-700 font-bold w-full text-center white-space-nowrap overflow-hidden text-overflow-ellipsis text-xl pt-3">BelovedYaoo</span>
            <span
                class="text-600 font-bold w-full text-center white-space-nowrap overflow-hidden text-overflow-ellipsis">永远都有更好，眼下便是最好</span>
        </div>
        <ConfirmDialog class="w-20rem md:w-30rem" group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
                    <div
                        class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                        <i class="pi pi-question text-5xl"></i>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex align-items-center gap-2 mt-4">
                        <Button label="确认" @click="acceptCallback"></Button>
                        <Button label="取消" outlined @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
    </Sidebar>
</template>

<style lang="scss" scoped>
.topbar-button {
    width: 36.6px;
    height: 36.6px;
}
</style>
