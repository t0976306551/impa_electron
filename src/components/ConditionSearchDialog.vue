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

        <div style="text-align: right" class="mt-5">
          <v-btn variant="text" @click="close">
            <p style="color: black" class="font-weight-bold">取消</p></v-btn
          >
          <v-btn variant="text" @click="test">
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

const emit = defineEmits(["close", "create"]);

const searchData = ref({
  code: null,
  chineseName: null,
  englishName: null,
});

const test = () => {
  console.log(searchData.value);
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
