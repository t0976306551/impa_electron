<template>
  <v-dialog width="auto" max-width="520" min-width="520">
    <v-card width="100%" class="overflow-auto">
      <v-toolbar color="#0065C1">
        <v-toolbar-title style="color: white"
          >Impa Code：{{ item.code }}</v-toolbar-title
        >
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
        <v-container>
          <v-row>
            <v-col cols="12" v-if="item.marks"> 標籤 </v-col>
            <v-col cols="12" v-if="!item.marks"> 該資料目前尚無標籤 </v-col>
            <v-col v-if="item.marks">
              <v-chip
                v-for="(mark, index) in item.marks"
                :key="index"
                class="ma-2"
                closable
                variant="outlined"
              >
                {{ mark.name }}
              </v-chip>
            </v-col>

            <v-col cols="12">
              <v-divider :thickness="4" color="info"></v-divider>
            </v-col>

            <v-col cols="12" v-if="item.remark"> 備註 </v-col>
            <v-col cols="12" v-if="!item.remark"> 該資料目前尚無備註 </v-col>

            <v-col cols="12">
              <v-divider :thickness="4" color="info"></v-divider>
            </v-col>

            <v-col cols="12">
              <v-btn variant="outlined" @click="openInsertMark()" class="ml-3">
                {{ insertMarkTitle }}
              </v-btn>
            </v-col>
            <v-col cols="9" v-if="insertMarkStatus">
              <v-select
                v-model="selectMarkValue"
                :items="selectMarkItem"
                chips
                label="Chips"
                multiple
              ></v-select>
            </v-col>
            <v-col cols="2" v-if="insertMarkStatus">
              <v-btn variant="outlined" class="ml-3"> 送出 </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <div style="text-align: right" class="mt-5">
          <v-btn variant="text" @click="close">
            <p style="color: black" class="font-weight-bold">關閉</p></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import type { Ref } from "vue";
import type { PropType } from "vue";
import type { Item, ItemWhole } from "../model/item.interface";

const emit = defineEmits(["close", "create"]);
const props = defineProps({
  item: {
    type: Object as PropType<ItemWhole>,
    required: true,
  },
});
const insertMarkStatus = ref(false);
const insertRemarkStatus = ref(false);
const insertMarkTitle = ref("");
const insertReamarkTitle = ref("");

const selectMarkItem = ref([]);
const selectMarkValue = ref([]);

onBeforeMount(async (): Promise<void> => {
  insertRemarkStatus.value = false;
  insertMarkTitle.value = "編輯標籤";
});

const openInsertMark = () => {
  if (insertMarkStatus.value) {
    insertMarkStatus.value = false;
    insertMarkTitle.value = "編輯標籤";
  } else {
    insertMarkStatus.value = true;
    insertMarkTitle.value = "關閉編輯標籤";
  }
};

const close = () => {
  emit("close");
};
</script>
