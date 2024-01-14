<template>
  <v-sheet>
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-sheet>
</template>

<script setup lang="ts">
import NavigationBar from "../components/layout/NavigationBar.vue";
</script>
