<script lang="ts" setup>
import type { Component } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useLayout } from '../service/layout';
import { useAgilityCoreStore } from '../service/store';

interface AppLayoutProps {
    appTopbar: Component,
    appSidebar: Component,
    appFooter: Component
}

const props = defineProps<AppLayoutProps>();

const store = useAgilityCoreStore();

// 监听屏幕尺寸变化
onMounted(() => {
    store.initWindowListener();
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
    };
});

const {layoutConfig, layoutState, isSidebarActive} = useLayout();

const outsideClickListener = ref();

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event: PointerEvent) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
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

const isOutsideClicked = (event: PointerEvent) => {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');
    if (sidebarEl === null) {
        return;
    }
    if (topbarEl !== null) {
        return !(sidebarEl.isSameNode(event.target as Node) || sidebarEl.contains(event.target as Node) || topbarEl.isSameNode(event.target as Node) || topbarEl.contains(event.target as Node));
    } else {
        return !(sidebarEl.isSameNode(event.target as Node) || sidebarEl.contains(event.target as Node));
    }
};
</script>

<template>
    <div :class="containerClass" class="layout-wrapper">
        <Component :is="props.appTopbar"/>
        <div class="layout-sidebar">
            <Component :is="props.appSidebar"/>
        </div>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view/>
            </div>
            <Component :is="props.appFooter"/>
        </div>
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
