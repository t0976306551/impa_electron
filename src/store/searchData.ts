import { defineStore } from 'pinia';
import type { Search } from '@/model/search.interface';

export const useSearchStore = defineStore('search', {
    persist: true,
    state: () => {
        return {
            data: {} as Search, // 或者 data: [] 如果 Search 是数组类型
        };
    },
    actions: {
        setSearchData(item: Search) {
            this.data = item;
        },
        clearSearchData() {
            this.data = Object.assign({}, {
                code: "",
                chineseName: "",
                englishName: ""
            });
        },
    },
});
