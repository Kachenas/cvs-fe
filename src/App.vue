<script setup>
import HomeComp from '@/components/HomeComponent.vue'
import MainComp from './views/MainView.vue'
import { userStore } from '@/stores/userStore'
const store = userStore()

</script>

<template>
  <div>
    <template v-if="store.isAuthenticated">
      <MainComp />
    </template>
    <template v-else>
      <HomeComp />
    </template>
  </div>
</template>
