import { defineStore, StoreGeneric } from 'pinia';

export interface StoreStateInterface extends StoreGeneric {
    windowWidth: number
    windowHeight: number
    flexEnable: () => boolean
}

export const useAgilityCoreStore = defineStore('agilityCore', {
    state: () => {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            flexEnable: (): boolean => {
                return false;
            }
        } as StoreStateInterface;
    },
    actions: {},
});