import { defineStore, StoreGeneric } from 'pinia';

export interface StoreStateInterface extends StoreGeneric {
    windowWidth: number
    windowHeight: number
    flexEnable: () => object
}

export const useAgilityCoreStore = defineStore('agilityCore', {
    state: () => {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            flexEnable: () => {
            }
        } as StoreStateInterface;
    },
    actions: {},
});