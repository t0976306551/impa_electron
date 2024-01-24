<template>
  <v-dialog width="auto" max-width="520" min-width="520">
    <v-card width="100%" class="overflow-auto">
      <v-toolbar color="red">
        <v-toolbar-title style="color: white">是否進行刪除</v-toolbar-title>
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
        <v-row justify="center" class="mt-5 mb-5"> 請確認是否刪除 </v-row>
        <div style="text-align: right" class="mt-5">
          <v-btn variant="text" @click="close">
            <p style="color: black" class="font-weight-bold">關閉</p></v-btn
          >
          <v-btn variant="text" @click="deleteStore">
            <p style="color: black" class="font-weight-bold">確認</p></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["close", "delete"]);

const deleteStore = () => {
  emit("delete");
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
