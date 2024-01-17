<template>
  <v-container fluid>
    <v-row v-for="(item, index) in itemList" :key="index" class="pa-3">
      <ImpaListCard :item="item" :index="index"></ImpaListCard
    ></v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import type { Ref } from "vue";
import type { Item, ItemWhole } from "@/model/item.interface";
import ImpaListCard from "@/components/ImpaListCard.vue";
import { ipcRenderer } from "electron";
import { getImpaDataByTypeId } from "@/api/imap";

const route = useRoute();
const currentId = ref(route.params.id);
const itemList: Ref<ItemWhole[]> = ref([]);

onBeforeMount(async (): Promise<void> => {
  await queryDatabase();
});

watch(
  () => route.params.id,
  (newId) => {
    // 在這裡更新 currentId 的值
    currentId.value = newId;
    queryDatabase();
  }
);

const queryDatabase = async (): Promise<void> => {
  try {
    itemList.value = [];
    itemList.value = await getImpaDataByTypeId(currentId.value);
  } catch (error) {
    console.error("Database query error:", error);
  }
  // items.value = await ItemApi.getAllItem();
};

// const itemList: Ref<Item[]> = ref([
//   {
//     id: 1,
//     code: "1111111",
//     image: "110106.JPG",
//     chineseName: '雙編丙綸長絲纜繩6-7/8"CIRX200MTR',
//     englishName: 'HAWSER P.P. DOUBLE-BRAIDED TOUGHLAY 6-7/8"CIRX200MTR',
//     type: "00. Provisions",
//     uom: "KGM",
//     content:
//       "A weldless, drop forged, carbon steel shackle with a flatheadpin which has a hole for a securing pin at one end. Ungalvanized.Size: Body dia: 50mm, Opening: 75mm, Clear Length: 227mm, Pin dia:60mm, S.W.L: 15ton.",
//   },
//   {
//     id: 2,
//     code: "2222222",
//     image: "110106.JPG",
//     chineseName: '雙編丙綸長絲纜繩6-7/8"CIRX200MTR',
//     englishName: 'HAWSER P.P. DOUBLE-BRAIDED TOUGHLAY 6-7/8"CIRX200MTR',
//     type: "00. Provisions",
//     uom: "KGM",
//     content:
//       "A weldless, drop forged, carbon steel shackle with a flatheadpin which has a hole for a securing pin at one end. Ungalvanized.Size: Body dia: 50mm, Opening: 75mm, Clear Length: 227mm, Pin dia:60mm, S.W.L: 15ton.",
//   },
//   {
//     id: 3,
//     code: "3333333",
//     image: "110106.JPG",
//     chineseName: '雙編丙綸長絲纜繩6-7/8"CIRX200MTR',
//     englishName: 'HAWSER P.P. DOUBLE-BRAIDED TOUGHLAY 6-7/8"CIRX200MTR',
//     type: "00. Provisions",
//     uom: "KGM",
//     content:
//       "A weldless, drop forged, carbon steel shackle with a flatheadpin which has a hole for a securing pin at one end. Ungalvanized.Size: Body dia: 50mm, Opening: 75mm, Clear Length: 227mm, Pin dia:60mm, S.W.L: 15ton.",
//   },
// ]);
</script>
