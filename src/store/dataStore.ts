import { defineStore } from 'pinia';
import type { Item } from '@/model/item.interface';

export const useItemStore = defineStore('item', {
    persist: true,
    state: () => {
        return {
            data: [] as Item[],
        };
    },
    actions: {
        setItem(item: Item[]) {
            this.data = item;
        },
        clearItem() {
            this.data = [];
        },
    },
});
