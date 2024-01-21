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
import { ref } from "vue";
import type { Ref } from "vue";

import { getImpaDataByCondition } from "@/api/imap";
const emit = defineEmits(["close", "create"]);
import { useItemStore } from "@/store/dataStore";
import { useRouter } from "vue-router";

const searchData = ref({
  code: "",
  chineseName: "",
  englishName: "",
});

const storeItem = useItemStore();
const router = useRouter();

const dataisNull = ref(true);

const searchImapData = async () => {
  dataisNull.value = true;
  if (
    searchData.value.code == "" &&
    searchData.value.chineseName == "" &&
    searchData.value.englishName == ""
  ) {
    dataisNull.value = false;
  }

  if (dataisNull.value) {
    let data = await getImpaDataByCondition(
      searchData.value.code,
      searchData.value.chineseName,
      searchData.value.englishName
    );

    if (typeof data != "boolean") {
      if (data.length > 0) {
        storeItem.setItem(data);
        searchData.value.code = "";
        searchData.value.chineseName = "";
        searchData.value.englishName = "";
        router.push("/00");
        emit("close");
      } else {
        dataisNull.value = false;
      }
    }
  }
};

// const createItem = () => {
//   if (createItemData.value.name != "") {
//     emit("create", createItemData.value);
//   }
// };

const close = () => {
  emit("close");
};
</script>
