<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from '../service/layout';
import { Icon } from '@iconify/vue';

const route = useRoute();

const { layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

const isActiveMenu = ref(false);
const itemKey = ref();

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? `${props.parentItemKey  }-${  props.index}` : String(props.index);
    const activeItem = layoutState.activeMenuItems;
    isActiveMenu.value = activeItem.value.some(item => item === itemKey.value) || activeItem.value ? activeItem.value.some(item => item.startsWith(`${itemKey.value}-`)) : false;
});

watch(
    () => layoutState.activeMenuItems.value,
    (newVal) => {
        if (!newVal) return;
        // 判断一下 newVal 里面是否包含 itemKey，以及是否有以 itemKey- 开头的元素
        isActiveMenu.value = newVal.some(item => item === itemKey.value) || newVal.some(item => item.startsWith(`${itemKey.value}-`));
    }
);
const itemClick = (event: MouseEvent | PointerEvent, item: any) => {
    if (item.disabled) {
        event.preventDefault();
        return;
    }
    const { overlayMenuActive, staticMenuMobileActive } = layoutState;
    if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
        onMenuToggle();
    }
    // 根据 当前项是否具有子项 来决定操作，激活当前操作项 或 移除激活项 或 不进行操作
    setActiveMenuItem(itemKey, item.items !== undefined);
};

const checkActiveRoute = (item: any) => {
    return route.path === item.to;
};
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
        <a v-if="(!item.to || item.items) && item.visible !== false" :class="item.class"
           :href="item.url" :target="item.target" tabindex="0" @click="itemClick($event, item)">
            <i v-if="!item.mdi" :class="item.icon" class="layout-menuitem-icon"></i>
            <Icon v-else :icon="item.mdi" :style="item.style" class="layout-menuitem-icon"/>
            <span class="layout-menuitem-text font-semibold">{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
        </a>
        <router-link v-if="item.to && !item.items && item.visible !== false"
                     :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
                     :to="item.to" tabindex="0" @click="itemClick($event, item)">
            <i v-if="item.icon&&!item.mdi" :class="item.icon" class="layout-menuitem-icon"></i>
            <Icon v-else :icon="item.mdi" :style="item.style" class="layout-menuitem-icon"/>
            <span class="layout-menuitem-text font-semibold">{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
        </router-link>
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child"
                               :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped></style>
