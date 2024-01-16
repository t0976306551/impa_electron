<template>
  <v-card color="white" theme="dark" class="card" min-width="445" width="100%">
    <div class="d-flex flex-no-wrap">
      <v-avatar class="ma-3" size="125" rounded="0">
        <v-img v-if="item.image != null" :src="getImageUrl(item.image)"></v-img>
      </v-avatar>
      <div class="ml-5" style="width: 100%">
        <v-card-text class="text-h7 py-5">
          <div style="display: flex; justify-content: space-between">
            <b>
              <p style="color: blue">IMPA Code：{{ item.code }}</p></b
            >
            <div>
              <v-icon
                color="red"
                icon="mdi mdi-content-paste"
                size="large"
              ></v-icon>
              &nbsp;
              <v-icon color="blue" icon="mdi mdi-label" size="large"></v-icon>
              &nbsp;
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
            分類：{{ item.typeId }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; UOM：{{
              item.uom
            }}
          </div>
          <div class="text--primary">內容：{{ item.content }}</div>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";
import type { PropType } from "vue";
import type { Item } from "../model/item.interface";
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});
const getImageUrl = (name: string) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href;
};
</script>

<style>
.card:hover {
  transform: translateY(-15px); /* 卡片向上漂浮 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* 陰影 */
}

.card:hover {
  cursor: pointer; /* 滑鼠停留時會有點擊特效 */
}
</style>
