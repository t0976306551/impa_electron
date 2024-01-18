<template>
  <v-dialog width="auto" max-width="520" min-width="520">
    <v-card width="100%" class="overflow-auto">
      <v-toolbar color="#0065C1">
        <v-toolbar-title style="color: white"
          >Impa Code：{{ ImpaData.code }}</v-toolbar-title
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
            <v-col cols="12" class="ml-1" v-if="ImpaData.marks"> 標籤 </v-col>
            <v-col cols="12" class="ml-1" v-if="!ImpaData.marks">
              <p style="color: red">該資料目前尚無標籤</p>
            </v-col>
            <v-col v-if="ImpaData.marks">
              <v-chip
                v-for="(mark, index) in ImpaData.marks"
                :key="index"
                class="ma-2"
                variant="outlined"
              >
                {{ mark.name }}
                <v-icon
                  class="ml-2 delete"
                  icon="mdi mdi-close-circle"
                  @click="deleteImpaMarks(ImpaData.id, mark.id)"
                ></v-icon>
              </v-chip>
            </v-col>

            <v-col cols="12">
              <v-divider :thickness="4" color="info"></v-divider>
            </v-col>
            <v-col cols="12" class="ml-1" v-if="ImpaData.remark"> 備註 </v-col>
            <v-col cols="12" class="ml-1" v-if="ImpaData.remark">
              {{ ImpaData.remark }}
            </v-col>
            <v-col cols="12" class="ml-1" v-if="!ImpaData.remark">
              <p style="color: red">該資料目前尚無備註</p>
            </v-col>

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
                v-model="sendSelectMark"
                :items="seleteMarks"
                item-title="name"
                item-value="id"
                chips
                label="Chips"
                multiple
              ></v-select>
            </v-col>

            <v-col cols="2" v-if="insertMarkStatus">
              <v-btn variant="outlined" class="ml-3" @click="sendMarkSelect()">
                送出
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-divider :thickness="4" color="info"></v-divider>
            </v-col>

            <v-col cols="12">
              <v-btn variant="outlined" @click="openInsertMark()" class="ml-3">
                {{ insertMarkTitle }}
              </v-btn>
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
    <LoadingDialog :dialog="loading"></LoadingDialog>
  </v-dialog>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import type { Ref } from "vue";
import type { PropType } from "vue";
import type { Item, ItemWhole } from "../model/item.interface";
import type { Mark } from "../model/mark.interface";
import {
  getMarkByNotObtained,
  createImpaMark,
  deleteImpaMark,
} from "@/api/mark";
import { getImpaDataById } from "@/api/imap";
import LoadingDialog from "@/components/Loading.vue";
const emit = defineEmits(["close", "create"]);
const props = defineProps({
  item: {
    type: Object as PropType<ItemWhole>,
    required: true,
  },
});
const loading = ref(false);
const ImpaData: Ref<ItemWhole> = ref(props.item);
const insertMarkStatus = ref(false);
const insertRemarkStatus = ref(false);
const insertMarkTitle = ref("");

const seleteMarks: Ref<Mark[]> = ref([]); //存放該資料沒有的標籤
const sendSelectMark = ref([]); //存放送出新增的標籤資料

onBeforeMount(async (): Promise<void> => {
  insertRemarkStatus.value = false;
  insertMarkTitle.value = "編輯標籤";
  ImpaData.value = await getImpaDataById(props.item.id);
  getMarkData();
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

const getMarkData = async () => {
  let marks = [];
  if (ImpaData.value.marks) {
    for (const mark of ImpaData.value.marks) {
      marks.push(mark.id);
    }
  }
  if (marks.length > 0) {
    seleteMarks.value = await getMarkByNotObtained(marks);
  } else {
    seleteMarks.value = await getMarkByNotObtained(null);
  }
};

const sendMarkSelect = async () => {
  loading.value = true;
  if (sendSelectMark.value.length > 0) {
    let createStatus = await createImpaMark(
      props.item.id,
      sendSelectMark.value
    );
    if (createStatus) {
      ImpaData.value = await getImpaDataById(ImpaData.value.id);
      await getMarkData();
      sendSelectMark.value = [];
    }
  }
  loading.value = false;
};

const deleteImpaMarks = async (dataId: number, markId: number) => {
  loading.value = true;
  let deleteStatus = await deleteImpaMark(dataId, markId);
  if (deleteStatus) {
    ImpaData.value = await getImpaDataById(ImpaData.value.id);
    await getMarkData();
  }
  loading.value = false;
};

const close = () => {
  emit("close");
};
</script>

<style>
.delete:hover {
  transform: translateY(-3px); /* 卡片向上漂浮 */
}
</style>
