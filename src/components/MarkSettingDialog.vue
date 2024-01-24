<template>
  <v-dialog width="auto" max-width="520" min-width="520">
    <v-card width="100%" class="overflow-auto">
      <v-toolbar color="#0065C1">
        <v-toolbar-title style="color: white">標籤設定</v-toolbar-title>
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
            <v-col cols="9">
              <v-text-field
                label="新增標籤"
                variant="outlined"
                v-model="name"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn variant="outlined" height="50" @click="createMarkData()">
                新增
              </v-btn></v-col
            >
            <v-col cols="12" v-if="errorStatus == true">
              <p style="color: red">{{ errorMessage }}</p>
            </v-col>
            <v-col cols="12">
              <v-divider :thickness="4" color="info"></v-divider>
            </v-col>

            <v-col>
              <v-chip
                v-for="(mark, index) in marks"
                :key="index"
                class="ma-2"
                variant="outlined"
              >
                {{ mark.name }}
                <v-icon
                  class="ml-2 delete"
                  icon="mdi mdi-close-circle"
                  @click="deleteMarkData(mark.id)"
                ></v-icon>
              </v-chip>
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

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import type { Ref } from "vue";
import { getAllMark, createMark, deleteMark, checkMark } from "@/api/mark";
import { Mark } from "@/model/mark.interface";
const emit = defineEmits(["close", "create"]);
const errorMessage = ref("");
const marks: Ref<Mark[]> = ref([]);
const name = ref("");
const errorStatus = ref(false);
onBeforeMount(async (): Promise<void> => {
  await getMarks();
});

const getMarks = async () => {
  errorStatus.value = false;
  marks.value = await getAllMark();
};

const createMarkData = async () => {
  errorStatus.value = false;
  if (name.value != "") {
    let check = await checkMark(name.value);
    if (check) {
      errorStatus.value = true;
      errorMessage.value = "請檢查是否有重複的標籤名稱";
    } else if (!check) {
      await createMark(name.value);
      name.value = "";
      await getMarks();
    }
  }
};

const deleteMarkData = async (id: number) => {
  if (id) {
    await deleteMark(id);
    await getMarks();
  }
};

const close = () => {
  name.value = "";
  emit("close");
};
</script>

<style>
.delete:hover {
  transform: translateY(-3px); /* 卡片向上漂浮 */
}
</style>
