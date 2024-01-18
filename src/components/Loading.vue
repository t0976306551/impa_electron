<template>
  <v-dialog v-model="showDialog" persistent>
    <div>
      <v-fade-transition>
        <v-row justify="center" align="center">
          <v-progress-circular
            indeterminate
            :width="6"
            :size="50"
            color="primary"
          ></v-progress-circular>
        </v-row>
      </v-fade-transition>
    </div>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed } from "vue";
const emit = defineEmits(["update:dialog"]);
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: "",
  },
});

const showDialog = computed({
  get: () => {
    return props.dialog;
  },
  set: (data: any) => {
    emit("update:dialog", data);
  },
});
</script>
