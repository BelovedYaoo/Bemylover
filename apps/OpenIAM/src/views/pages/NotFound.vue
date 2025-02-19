<script lang="ts" setup>
import { useLayout } from 'agility-core/src/service/layout';
import router from '@/service/router';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const {isDarkTheme} = useLayout();
const route = useRoute();

const getAlpha = () => {
    const alpha = isDarkTheme.value ? 0.9 : 0.4;
    return `background: linear-gradient(180deg, rgba(33, 150, 243, ${alpha}) 10%, rgba(33, 150, 243, 0) 30%)`;
};

// 获取退回步数（带默认值）
const backSteps = computed(() => {
    // 默认退回 1 步
    const steps = -Number(route.query.backSteps) || -1;
    // 确保至少退回 1 步
    return Math.min(-1, steps);
});
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div :style="getAlpha()" style="border-radius: 56px; padding: 0.3rem">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                     style="border-radius: 53px">
                    <div class="grid flex flex-column align-items-center">
                        <div class="flex justify-content-center align-items-center border-circle mt-3"
                             style="height: 3.2rem; width: 3.2rem">
                            <img alt="logo" class="mb-5 w-6rem flex-shrink-0" src="/images/logo.svg"/>
                        </div>
                        <span class="text-blue-500 font-bold text-3xl">404</span>
                        <h1 class="text-900 font-bold text-5xl mb-2 mt-2">Not Found</h1>
                        <span class="text-600 mb-5 mt-2">请求的资源不存在</span>
                        <img alt="Error" class="mb-5" src="/images/notfound.svg" width="80%"/>
                        <Button class="text-blue-500" icon="pi pi-arrow-left" label="返回" link
                                @click="router.go(backSteps)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
