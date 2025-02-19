import { defineStore, StoreGeneric } from 'pinia';

// 类型接口，需显式继承 StoreGeneric，否则 storeToRefs<StoreStateInterface> 会出现 TS 类型错误
export interface StoreStateInterface extends StoreGeneric {
    windowWidth: number
    windowHeight: number
    flexEnable: boolean
}

export const SM: number = 576;
export const MD: number = 768;
export const LG: number = 992;
export const XL: number = 1200;

export const useAgilityCoreStore = defineStore('agilityCore', {
    state: (): StoreStateInterface => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        flexEnable: false
    }),
    getters: {
        // 响应式断点判断
        inSM: function (): boolean {
            return this.windowWidth < SM;
        },
        inMD: function (): boolean {
            return this.windowWidth < MD;
        },
        inLG: function (): boolean {
            return this.windowWidth < LG;
        },
        inXL: function (): boolean {
            return this.windowWidth < XL;
        },
        isGtSM: function (): boolean {
            return this.windowWidth >= SM;
        },
        isGtMD: function (): boolean {
            return this.windowWidth >= MD;
        },
        isGtLG: function (): boolean {
            return this.windowWidth >= LG;
        },
        isGtXL: function (): boolean {
            return this.windowWidth >= XL;
        },
    },
    actions: {
        // 初始化窗口监听
        initWindowListener: function (): void {
            if (typeof window === 'undefined') return;
            const updateDimensions = (): void => {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
            };
            window.addEventListener('resize', updateDimensions);
        }
    }
});