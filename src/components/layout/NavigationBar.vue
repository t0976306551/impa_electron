<template>
  <v-sheet>
    <v-navigation-drawer
      v-model="drawer"
      permanent
      border="1"
      color="white"
      width="180"
      :elevation="2"
    >
      <v-list density="compact" nav class="pa-0">
        <template v-for="(item, index) in navItems">
          <v-list-item
            v-if="!item.children"
            :to="item.url"
            link
            :key="'nav-' + index"
            :title="item.title"
            :active="currentUrl === item.url"
            active-class="active-nav-item"
            class="mt-6 ml-2 pr-2 rounded-s-pill nav-item"
          >
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar flat color="white" :elevation="2">
      <v-toolbar-title>
        <div class="d-flex align-center">
          <span class="text-h5"> IMPA System </span>
        </div>
      </v-toolbar-title>
      <ConditionSearchDialog
        v-model="conditionSearchStatus"
        @close="conditionSearchStatus = false"
      />
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
          @click="conditionSearchStatus = true"
          class="ml-3"
        >
          新增標籤
        </v-btn>
        <!-- <v-btn v-if="!isLoggedIn" to="/login" color="primary" variant="flat"
          >登入</v-btn
        >
        <v-btn v-else @click="logout" color="primary" variant="flat"
          >登出</v-btn
        > -->
      </template>
    </v-app-bar>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import ConditionSearchDialog from "../../components/ConditionSearchDialog.vue";
interface NavItem {
  title: string;
  url: string;
  children?: NavItem[];
}

const drawer = ref();
const route = useRoute();
const title = computed(() => route.meta.title);
const currentUrl = computed(() => route.path);
const conditionSearchStatus = ref(false);
const navItems: NavItem[] = [
  {
    title: "首頁",
    url: "/",
  },
  {
    title: "伺服器",
    url: "/hellow",
  },
  {
    title: "監視器畫面與紀錄",
    url: "/",
  },
  {
    title: "監視器調閱",
    url: "/",
  },
  {
    title: "系統設定",
    url: "/",
  },
  {
    title: "NTP紀錄",
    url: "ntp-client",
  },
];
const handleDrawerClick = () => {
  drawer.value = !drawer.value;
};
</script>
