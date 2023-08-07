<script setup>
import { defineComponent } from 'vue'
import RegularUser from '../components/RegularUser/regularUserComp.vue'
import GroupUser from '../components/GroupAdminUser/groupUserComp.vue'
import SuperUser from '../components/SuperAdminUser/superUserComp.vue'

import { userStore } from '@/stores/userStore'
const authStore = userStore()
</script>
<template>
  <v-app>
    <v-app-bar
      color="teal-darken-4"
      image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      app
    >
      <v-app-bar-nav-icon @click="authStore.drawer = !authStore.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Customer Voucher System</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="authStore.drawer"
      image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      app
    >
    <v-spacer></v-spacer>
      <v-list>
        <v-btn @click="authStore.logout" class="mt-1" block outlined color="white">Logout</v-btn>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <!-- <v-container fluid><RouterView /></v-container> -->
      <v-container fluid>
        <div class="dashboard">
          <div v-if="authStore.userRole === 1">
            <RegularUser />
          </div>
          <div v-else-if="authStore.userRole === 2">
            <GroupUser />
          </div>
          <div v-else-if="authStore.userRole === 3">
            <SuperUser />
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>