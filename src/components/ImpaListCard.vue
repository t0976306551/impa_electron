<template>
  <v-card color="white" theme="dark" class="card" min-width="445" width="100%">
    <div class="d-flex flex-no-wrap">
      <v-avatar class="ma-3" size="125" rounded="0">
        <v-img v-if="item.image != null" :src="getImageUrl(item.image)"></v-img>
      </v-avatar>
      <div class="ml-5" style="width: 100%">
        <v-card-text class="text-h7 py-4">
          <div style="display: flex; justify-content: space-between">
            <b>
              <p style="color: blue">IMPA Code：{{ item.code }}</p>
              <p style="color: blue">分類：{{ item.typeName }}</p></b
            >

            <div class="ml-2">
              <v-btn
                block
                color="blue"
                rounded="xl"
                size="small"
                variant="outlined"
                @click="impaDetailStatus = true"
                >詳細資訊</v-btn
              >
            </div>
          </div>
          <div>
            <b
              ><p style="color: blue">中文名稱：{{ item.chineseName }}</p></b
            >
          </div>
          <div>
            <b
              ><p style="color: blue">英文名稱：{{ item.englishName }}</p></b
            >
          </div>
          <div class="text--primary">
            <b>UOM：</b>{{ item.uom }} &nbsp;&nbsp; <b>MTMLUOM：</b
            >{{ item.mtmlUom }}
          </div>
          <div class="text--primary"><b>內容：</b>{{ item.content }}</div>
        </v-card-text>
      </div>
    </div>
  </v-card>
  <template>
    <ImpaDetailsDialog
      v-if="impaDetailStatus"
      :item="item"
      v-model="impaDetailStatus"
      @close="impaDetailStatus = false"
      @update-store="updateStoreEmit"
      :current-id="currentId"
    />
  </template>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";
import type { PropType } from "vue";
import type { Item, ItemWhole } from "../model/item.interface";
import ImpaDetailsDialog from "@/components/ImpaDetailsDialog.vue";
const emit = defineEmits(["updateStore"]);
const props = defineProps({
  item: {
    type: Object as PropType<ItemWhole>,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
  currentId: {
    type: String,
    default: "",
  },
});
const impaDetailStatus = ref(false);

const getImageUrl = (name: string) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href;
};
const updateStoreEmit = () => {
  emit("updateStore");
};
</script>

<style>
.card:hover {
  transform: translateY(-15px); /* 卡片向上漂浮 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* 陰影 */
}
</style>
