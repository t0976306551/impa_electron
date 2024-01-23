<template>
  <v-dialog width="auto" max-width="520" min-width="520">
    <v-card width="100%" class="overflow-auto">
      <v-toolbar color="#0065C1">
        <v-toolbar-title style="color: white"
          >Impa Code：{{ ImpaData.code }}
        </v-toolbar-title>
        <v-chip
          variant="flat"
          :color="storeBtnColor"
          @click="updateDataStore(ImpaData.id, ImpaData.storeStatus)"
        >
          {{ storeStatusText }}
        </v-chip>
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
              <v-btn
                variant="outlined"
                @click="openInsertRemark()"
                class="ml-3"
              >
                {{ insertRamarkTitle }}
              </v-btn>
            </v-col>

            <v-col cols="9" v-if="insertRemarkStatus">
              <v-textarea
                label="Label"
                variant="outlined"
                v-model="remarkValue"
              ></v-textarea>
            </v-col>

            <v-col cols="2" v-if="insertRemarkStatus">
              <v-btn
                variant="outlined"
                class="ml-3"
                @click="editRemark(ImpaData.id, remarkValue)"
              >
                送出
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
import {
  getImpaDataById,
  updateRemarkById,
  updateStoreStatus,
} from "@/api/imap";
import LoadingDialog from "@/components/Loading.vue";

const emit = defineEmits(["close", "create", "updateStore"]);
const props = defineProps({
  item: {
    type: Object as PropType<ItemWhole>,
    required: true,
  },
  currentId: {
    type: String,
    default: "",
  },
});
const loading = ref(false);
const ImpaData: Ref<ItemWhole> = ref(props.item);

const insertMarkStatus = ref(false);
const insertRemarkStatus = ref(false);
const insertMarkTitle = ref("");
const insertRamarkTitle = ref("");
const seleteMarks: Ref<Mark[]> = ref([]); //存放該資料沒有的標籤
const sendSelectMark = ref([]); //存放送出新增的標籤資料

const storeBtnColor = ref("");
const storeStatusText = ref("");
const remarkValue = ref("");

onBeforeMount(async (): Promise<void> => {
  insertMarkStatus.value = false;
  insertMarkTitle.value = "編輯標籤";
  insertRemarkStatus.value = false;
  insertRamarkTitle.value = "編輯備註";
  ImpaData.value = await getImpaDataById(props.item.id);
  if (ImpaData.value.remark != null) {
    remarkValue.value = ImpaData.value.remark;
  }
  if (ImpaData.value.storeStatus == 0) {
    storeBtnColor.value = "red";
    storeStatusText.value = "尚未儲存";
  } else {
    storeBtnColor.value = "green";
    storeStatusText.value = "已儲存";
  }

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

const openInsertRemark = () => {
  if (insertRemarkStatus.value) {
    insertRemarkStatus.value = false;
    insertRamarkTitle.value = "編輯備註";
  } else {
    insertRemarkStatus.value = true;
    insertRamarkTitle.value = "關閉編輯備註";
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

const editRemark = async (dataId: number, remark: string) => {
  loading.value = true;
  let updateStatus = await updateRemarkById(dataId, remark);
  if (updateStatus) {
    ImpaData.value = await getImpaDataById(ImpaData.value.id);
    insertRemarkStatus.value = false;
    insertRamarkTitle.value = "編輯備註";
  }

  loading.value = false;
};

const updateDataStore = async (dataId: number, storeStatus: number) => {
  loading.value = true;
  let status = false;
  if (storeStatus == 0) {
    status = true;
  } else {
    status = false;
  }
  let updateStore = await updateStoreStatus(dataId, status);
  if (updateStore) {
    ImpaData.value = await getImpaDataById(ImpaData.value.id);
    if (status) {
      storeStatusText.value = "已儲存";
      storeBtnColor.value = "green";
    } else {
      storeStatusText.value = "尚未儲存";
      storeBtnColor.value = "red";
    }
    updateStoreEmit();
  }
  loading.value = false;
};

const close = () => {
  emit("close");
};

const updateStoreEmit = () => {
  emit("updateStore");
  if (props.currentId == "0") {
    close();
  }
};
</script>

<style>
.delete:hover {
  transform: translateY(-3px); /* 卡片向上漂浮 */
}
</style>
