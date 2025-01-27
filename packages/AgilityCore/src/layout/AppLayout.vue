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

const route = useRoute();

const store = useAgilityCoreStore();

const {windowWidth, windowHeight} = storeToRefs<StoreStateInterface>(store);

// 屏幕尺寸监听
const getWindowResize = function () {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
};

// 挂载时监听屏幕尺寸变化
onMounted(() => {
    window.addEventListener('resize', getWindowResize);
});

// 卸载时移除监听
onUnmounted(() => {
    window.removeEventListener('resize', getWindowResize);
});

// 启用 Flex 布局所需的最低宽度
const flexMinWidth = ref(575);

// 当前路由是否处于 Flex 布局启用名单
const inFlex = computed(() => {
    return props.isFlex.some((name) => name === route.name);
});

// 是否启用 Flex 布局
const flexEnable = computed(() => {
    return inFlex.value && windowWidth.value > flexMinWidth.value;
});

// 屏幕宽度监听
watch(windowWidth, (newVal) => {
    // 当前路由处于 Flex 布局启用名单中时
    if (inFlex.value) {
        // 当屏幕宽度小于启用 Flex 布局所需的最低宽度时，移除 Flex 布局，否则启用 Flex 布局
        if (newVal < flexMinWidth.value) {
            document.querySelector('.layout-main')?.classList.remove('flex');
        } else {
            document.querySelector('.layout-main')?.classList.add('flex');
        }
    }
});

// 布局容器动态类
const mainClass = computed(() => {
    return {
        // Flex 布局
        flex: flexEnable.value
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
            <div :class="mainClass" class="layout-main">
                <router-view></router-view>
            </div>
            <Component :is="props.appFooter"/>
        </div>
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
