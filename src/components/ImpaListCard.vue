<template>
  <v-card color="white" theme="dark" class="card" min-width="445">
    <div class="d-flex flex-no-wrap">
      <v-avatar class="ma-3" size="125" rounded="0">
        <v-img :src="getImageUrl(item.image)"></v-img>
      </v-avatar>
      <div class="ml-5">
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
            分類：{{ item.type }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; UOM：{{
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
  transform: translateY(-15px); /* 让卡片稍微向上飘浮 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
}

.card:hover {
  cursor: pointer; /* 鼠标悬停时显示手掌样式 */
}
</style>
