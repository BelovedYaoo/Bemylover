<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useLayout } from '../service/layout';
import { useRoute } from 'vue-router';
import { StoreStateInterface, useAgilityCoreStore } from '../service/store';
import { storeToRefs } from 'pinia';

interface AppLayoutProps {
    appTopbar: any,
    appSidebar: any,
    appFooter: any,
    isFlex: string[]
}

const props = defineProps<AppLayoutProps>();

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref();

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const mainClass = computed(() => {
    return {
        flex: props.isFlex.some((name) => name === useRoute().name)
    };
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

const store = useAgilityCoreStore();
const { windowWidth, windowHeight } = storeToRefs<StoreStateInterface>(store);

onMounted(() => {
    window.addEventListener('resize', getWindowResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', getWindowResize);
});

// 获取屏幕尺寸
const getWindowResize = function () {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
};
</script>

<template>
    <div :class="containerClass" class="layout-wrapper">
        <Component :is="props.appTopbar"/>
        <div class="layout-sidebar">
            <Component :is="props.appSidebar"/>
        </div>
        <div class="layout-main-container">
            <div :class="mainClass" class="layout-main">
                <router-view></router-view>
            </div>
            <Component :is="props.appFooter"/>
        </div>
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
