<script lang="ts" setup>
import AppTopbar from 'agility-core/src/layout/AppTopbar.vue';
import { globalConfig } from '@/service/globalQuote';
</script>

<template>
    <AppTopbar :app-name="globalConfig.appName">
        <template #appIcon>
            <img alt="logo" src="/images/logo.svg" />
        </template>
        <template #topbarMenu>
            <Button class="m-0 p-0 layout-menu-button topbar-button" icon="pi pi-bookmark" rounded
                    severity="secondary" size="large" text/>
            <Button class="m-0 p-0 layout-menu-button topbar-button" icon="pi pi-search" rounded
                    severity="success" size="large" text/>
            <Avatar image="https://avatars.githubusercontent.com/u/103827252?v=4" shape="circle"
                    size="large" style="background-color: #ece9fc; color: #2a1261"/>
        </template>
    </AppTopbar>
</template>

<style lang="scss" scoped>
.topbar-button {
    width: 36.6px;
    height: 36.6px;
}
</style>
