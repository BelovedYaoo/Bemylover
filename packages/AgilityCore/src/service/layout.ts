import { computed, reactive, toRefs } from 'vue';
import { LG } from './store';

const layoutConfig = reactive({
    // 按钮的涟漪效果
    ripple: true,
    // 是否处于深色模式
    darkTheme: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    scale: 14,
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItems: []
});

export function useLayout() {
    const switchDarkTheme = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        const elementId = 'theme-css';
        const linkElement: HTMLElement | null = document.getElementById(elementId);
        const cloneLinkElement: Node = (linkElement as HTMLElement).cloneNode(true);
        const newThemeUrl = linkElement?.getAttribute('href')?.replace(!layoutConfig.darkTheme ? 'dark' : 'light', layoutConfig.darkTheme ? 'dark' : 'light');
        (cloneLinkElement as Element).setAttribute('id', `${elementId}-clone`);
        (cloneLinkElement as Element).setAttribute('href', (newThemeUrl as string));
        cloneLinkElement.addEventListener('load', () => {
            (linkElement as HTMLElement).remove();
            (cloneLinkElement as Element).setAttribute('id', elementId);
        });
        (linkElement as HTMLElement)?.parentNode?.insertBefore(cloneLinkElement, (linkElement as HTMLElement).nextSibling);
    };

    const setScale = (scale: number) => {
        layoutConfig.scale = scale;
    };

    const setActiveMenuItem = (item: any, allowRemove: boolean) => {
        const index = layoutState.activeMenuItems.indexOf(item.value);
        // 如果新操作项是已激活项，且允许移除已激活项，则移除已激活项
        if (index !== -1 && allowRemove) {
            layoutState.activeMenuItems = layoutState.activeMenuItems.filter(k => k !== item.value);
            return;
        }
        // 如果已激活项是新操作项的子项，则不激活新操作项
        if (layoutState.activeMenuItems.some(k => item.value.startsWith(k))) {
            return;
        }
        // 激活新操作项
        layoutState.activeMenuItems = [...layoutState.activeMenuItems, item.value];
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > LG) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    return {
        layoutConfig: toRefs(layoutConfig),
        layoutState: toRefs(layoutState),
        switchDarkTheme: switchDarkTheme,
        setScale: setScale,
        onMenuToggle: onMenuToggle,
        isSidebarActive: isSidebarActive,
        isDarkTheme: isDarkTheme,
        setActiveMenuItem: setActiveMenuItem
    };
}
