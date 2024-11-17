import { defineStore, StoreGeneric } from 'pinia';

export interface StoreStateInterface extends StoreGeneric {
    windowWidth: number
    windowHeight: number
}

export const useAgilityCoreStore = defineStore('agilityCore', {
    state: () => {
        return {
            windowWidth: 1920,
            windowHeight: 1080
        } as StoreStateInterface;
    },
    actions: {},
});