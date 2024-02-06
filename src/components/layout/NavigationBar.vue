<template>
  <v-sheet>
    <v-app-bar color="white" :elevation="2">
      <v-toolbar-title>
        <div class="d-flex align-center">
          <span class="text-h5"> IMPA System </span>
        </div>
      </v-toolbar-title>

      <template v-slot:append>
        <v-btn
          variant="outlined"
          @click="conditionSearchStatus = true"
          class="ml-3"
        >
          條件搜尋
        </v-btn>
        <v-btn
          variant="outlined"
          @click="markSettingStatus = true"
          class="ml-3"
        >
          新增標籤
        </v-btn>
        <v-btn variant="outlined" to="/0" link class="ml-3">
          查看儲存資料
        </v-btn>
        <!-- <v-btn v-if="!isLoggedIn" to="/login" color="primary" variant="flat"
          >登入</v-btn
        >
        <v-btn v-else @click="logout" color="primary" variant="flat"
          >登出</v-btn
        > -->
      </template>
    </v-app-bar>

    <template>
      <ConditionSearchDialog
        v-model="conditionSearchStatus"
        @close="conditionSearchStatus = false"
        :status="conditionSearchStatus"
      />
    </template>
    <template>
      <MarkSettingDialog
        v-model="markSettingStatus"
        @close="markSettingStatus = false"
      />
    </template>
    <v-navigation-drawer
      v-model="drawer"
      permanent
      border="1"
      color="white"
      width="305"
      :elevation="2"
    >
      <v-list density="compact" nav class="pa-0">
        <template v-for="(item, index) in navItems" :key="'nav-' + index">
          <v-list-item
            :to="item.url"
            link
            :title="item.title"
            :active="currentUrl === item.url"
            active-class="active-nav-item"
            class="mt-6 ml-2 pr-2 rounded-s-pill nav-item"
          >
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import ConditionSearchDialog from "@/components/ConditionSearchDialog.vue";
import MarkSettingDialog from "@/components/MarkSettingDialog.vue";
import type { Type } from "@/model/type.interface";
import { getTypeDatas } from "@/api/type";

interface NavItem {
  title: string;
  url: string;
}

const drawer = ref();
const route = useRoute();
const title = computed(() => route.meta.title);
const currentUrl = computed(() => route.path);
const conditionSearchStatus = ref(false);
const markSettingStatus = ref(false);
const navItems: Ref<NavItem[]> = ref([]);
const handleDrawerClick = () => {
  drawer.value = !drawer.value;
};

const getTypeData = async () => {
  await getTypeDatas()
    .then((datas) => {
      datas.forEach((itemValue: Type) => {
        let data: NavItem = {
          title: itemValue.name,
          url: "/" + itemValue.id,
        };

        if (itemValue.id != 35) {
          navItems.value.push(data);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

onBeforeMount(async (): Promise<void> => {
  await getTypeData();
});
</script>
