import { defineStore } from 'pinia';
import type { Item, ItemWhole } from '@/model/item.interface';

export const useItemStore = defineStore('item', {
    persist: true,
    state: () => {
        return {
            data: [] as ItemWhole[],
        };
    },
    actions: {
        setItem(item: ItemWhole[]) {
            this.data = item;
        },
        clearItem() {
            this.data = [];
        },
    },
});
