<template>
  <v-dialog width="auto" max-width="520" min-width="520">
    <v-card width="100%" class="overflow-auto">
      <v-toolbar color="#0065C1">
        <v-toolbar-title style="color: white">條件搜尋</v-toolbar-title>
        <v-btn
          width="35"
          height="35"
          icon="mdi-close"
          color="white"
          class="ml-1"
          @click="close"
          ><v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          label="IMPA code"
          variant="outlined"
          v-model="searchData.code"
        ></v-text-field>

        <v-text-field
          label="中文名稱"
          variant="outlined"
          v-model="searchData.chineseName"
        ></v-text-field>

        <v-text-field
          label="英文名稱"
          variant="outlined"
          v-model="searchData.englishName"
        ></v-text-field>

        <v-text-field
          label="備注搜尋"
          variant="outlined"
          v-model="searchData.remark"
        ></v-text-field>

        <v-select
          v-model="searchData.mark"
          :items="seleteMarks"
          item-title="name"
          item-value="id"
          label="標籤搜尋"
        ></v-select>

        <v-row v-if="!dataisNull" justify="center" class="mt-2">
          <p style="color: red">查無資料</p>
        </v-row>
        <div style="text-align: right" class="mt-5">
          <v-btn variant="text" @click="close">
            <p style="color: black" class="font-weight-bold">取消</p></v-btn
          >
          <v-btn variant="text" @click="searchImapData">
            <p style="color: #0065c1" class="font-weight-bold">確定</p></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import type { Ref } from "vue";
import { getImpaDataByCondition } from "@/api/imap";
const emit = defineEmits(["close", "create"]);
import { useItemStore } from "@/store/dataStore";
import { useSearchStore } from "@/store/searchData";
import { useRouter } from "vue-router";
import type { Mark } from "../model/mark.interface";
import { getAllMark } from "@/api/mark";
const searchData = ref({
  code: "",
  chineseName: "",
  englishName: "",
  remark: "",
  mark: "",
});

const storeItem = useItemStore();
const storeSearch = useSearchStore();
const router = useRouter();

const dataisNull = ref(true);

const seleteMarks: Ref<Mark[]> = ref([]); //存放該資料沒有的標籤

onBeforeMount(async (): Promise<void> => {
  await getMarkData();
});

const searchImapData = async () => {
  dataisNull.value = true;
  if (
    searchData.value.code == "" &&
    searchData.value.chineseName == "" &&
    searchData.value.englishName == "" &&
    searchData.value.remark == "" &&
    searchData.value.mark == ""
  ) {
    dataisNull.value = false;
  }

  if (dataisNull.value) {
    let data = await getImpaDataByCondition(
      searchData.value.code,
      searchData.value.chineseName,
      searchData.value.englishName,
      searchData.value.remark,
      searchData.value.mark
    );

    if (typeof data != "boolean") {
      if (data.length > 0) {
        storeItem.setItem(data);
        storeSearch.setSearchData(searchData.value);
        searchData.value.code = "";
        searchData.value.chineseName = "";
        searchData.value.englishName = "";
        searchData.value.remark = "";
        searchData.value.mark = "";
        router.push("/00");
        emit("close");
      } else {
        dataisNull.value = false;
      }
    }
  }
};

const getMarkData = async () => {
  seleteMarks.value = await getAllMark();
};

const close = () => {
  emit("close");
};
</script>
