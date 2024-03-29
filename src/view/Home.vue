<template>
  <v-container fluid>
    <v-row justify="end" class="pa-3" v-if="currentId == '0'">
      <v-btn variant="tonal" color="green" @click="exportToExcel">
        匯出成Excel檔案
      </v-btn>
    </v-row>
    <v-row v-for="(item, index) in itemList" :key="index" class="pa-3">
      <ImpaListCard
        :item="item"
        :index="index"
        :current-id="currentId"
        @update-store="judgeStoreUpdate"
      ></ImpaListCard
    ></v-row>
    <LoadingDialog :dialog="loading"></LoadingDialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import type { Ref } from "vue";
import type { Item, ItemWhole } from "@/model/item.interface";
import ImpaListCard from "@/components/ImpaListCard.vue";
import { ipcRenderer } from "electron";
import { getImpaDataByTypeId, getImpaDataByStore } from "@/api/imap";
import LoadingDialog from "@/components/Loading.vue";
import * as XLSX from "xlsx";

const route = useRoute();
const currentId: any = ref(route.params.id);
const itemList: Ref<ItemWhole[]> = ref([]);
const loading = ref(false);
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
    loading.value = true;
    itemList.value = [];
    if (currentId.value != "0") {
      itemList.value = await getImpaDataByTypeId(currentId.value);
    } else if (currentId.value == "0") {
      itemList.value = await getImpaDataByStore();
    } else if (currentId.value == "00") {
      console.log("我是條件搜尋");
    }
    loading.value = false;
  } catch (error) {
    console.error("Database query error:", error);
  }
};

const judgeStoreUpdate = async () => {
  if (currentId.value == "0") {
    itemList.value = await getImpaDataByStore();
  }
};

const exportToExcel = async (): Promise<void> => {
  let datas: any[] = [];
  let dataObject = {
    Impa編碼: "",
    中文名稱: "",
    英文名稱: "",
    分類: "",
    Uom: "",
    MtmlUom: "",
    備註: "",
    標籤: "",
  };

  for (const item of itemList.value) {
    dataObject = {
      Impa編碼: "",
      中文名稱: "",
      英文名稱: "",
      分類: "",
      Uom: "",
      MtmlUom: "",
      備註: "",
      標籤: "",
    };
    dataObject.Impa編碼 = item.code;
    dataObject.中文名稱 = item.chineseName;
    dataObject.英文名稱 = item.englishName;
    dataObject.分類 = item.typeName;
    dataObject.Uom = item.uom ? item.uom : "無";
    dataObject.MtmlUom = item.mtmlUom ? item.mtmlUom : "無";
    dataObject.備註 = item.remark ? item.remark : "無";
    dataObject.標籤 = item.marks
      ? item.marks.map((mark) => `${mark.name}`).join(" , ")
      : "無";
    datas.push(dataObject);
  }

  const worksheet = XLSX.utils.json_to_sheet(datas, {
    header: [
      "Impa編碼",
      "中文名稱",
      "英文名稱",
      "分類",
      "Uom",
      "MtmlUom",
      "備註",
      "標籤",
    ],
  });

  const colWidths = [
    { wch: 10 },
    { wch: 30 },
    { wch: 30 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 30 },
    { wch: 30 },
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "Impa_data.xlsx");
};
</script>
