<template>
  <v-container fluid>
    <v-row justify="end" class="pa-3" v-if="currentId == '0'">
      <v-btn variant="tonal" class="mr-3" color="green" @click="exportToExcel">
        匯出成Excel檔案
      </v-btn>

      <v-btn variant="tonal" color="red" @click="checkdeleteAllStore">
        刪除全部以儲存資料
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
    <DeleteDialog
      v-model="deleteDialogStatus"
      @close="deleteDialogStatus = false"
      @delete="deleteAllStore"
    ></DeleteDialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from "vue";
import { useRoute } from "vue-router";
import type { Ref, ComputedRef } from "vue";
import type { ItemWhole } from "@/model/item.interface";
import ImpaListCard from "@/components/ImpaListCard.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import {
  getImpaDataByTypeId,
  getImpaDataByStore,
  deleteAllStoreStatus,
} from "@/api/imap";
import LoadingDialog from "@/components/Loading.vue";
import * as XLSX from "xlsx";
import { useItemStore } from "@/store/dataStore";

const route = useRoute();
const currentId: any = ref(route.params.id);
const itemList: Ref<ItemWhole[]> = ref([]);
const loading = ref(false);
const storeItem = useItemStore();

const deleteDialogStatus = ref(false);
const storeImpaItem: ComputedRef<ItemWhole[]> = computed(() => storeItem.data);

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

watch(
  () => storeImpaItem.value,
  (newData) => {
    if ((currentId.value = "00")) {
      if (newData.length > 0) {
        queryDatabase();
      }
    }
  }
);

const queryDatabase = async (): Promise<void> => {
  try {
    loading.value = true;
    itemList.value = [];
    if (currentId.value != "0" && currentId.value != "00") {
      itemList.value = await getImpaDataByTypeId(currentId.value);
    } else if (currentId.value == "0") {
      itemList.value = await getImpaDataByStore();
    } else if (currentId.value == "00") {
      itemList.value = storeImpaItem.value;
    }
    loading.value = false;
  } catch (error) {
    console.error("Database query error:", error);
  }
};

const judgeStoreUpdate = async () => {
  if (currentId.value == "0") {
    itemList.value = await getImpaDataByStore();
  } else if (currentId.value !== "0" && currentId.value != "00") {
    queryDatabase();
  }
};

const checkdeleteAllStore = async () => {
  deleteDialogStatus.value = true;
};

const deleteAllStore = async () => {
  await deleteAllStoreStatus();
  deleteDialogStatus.value = false;
  window.location.reload();
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
  itemList.value = await getImpaDataByStore();

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
