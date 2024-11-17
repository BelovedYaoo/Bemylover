<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLayout } from '../service/layout';

interface AppTopbarProps {
    appName: string,
}

const props = defineProps<AppTopbarProps>();

const { switchDarkTheme, layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref();
const topbarMenuActive = ref(false);

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event:PointerEvent) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event:PointerEvent) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu') as Node;
    const topbarEl = document.querySelector('.layout-topbar-menu-button') as Node;

    return !(sidebarEl.isSameNode(event.target as Node) || sidebarEl.contains(event.target as Node) || topbarEl.isSameNode(event.target as Node) || topbarEl.contains(event.target as Node));
};
const logoUrl = computed(() => {
    return `images/${layoutConfig.darkTheme.value ? 'day' : 'night'}.svg`;
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo" @click="onMenuToggle()">
            <slot name="appIcon"></slot>
            <span class="pl-2">{{ props.appName }}</span>
        </div>

        <button class="p-link layout-menu-button layout-topbar-button ayou" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div :class="topbarMenuClasses" class="gap-3 layout-topbar-menu align-items-center">
            <Button class="m-0 layout-menu-button justify-center" style="padding: 7.7px" rounded text
                @click="switchDarkTheme()">
                <img :src="logoUrl" alt="s" height="20" width="20" />
            </Button>
            <slot name="topbarMenu"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>
