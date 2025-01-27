import { defineStore, StoreGeneric } from 'pinia';

export interface StoreStateInterface extends StoreGeneric {
    windowWidth: number
    windowHeight: number
}

export const useAgilityCoreStore = defineStore('agilityCore', {
    state: () => {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        } as StoreStateInterface;
    },
    actions: {},
});