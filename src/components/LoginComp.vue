<script setup>
import { useFormValidator } from '../utilities/utils'
import { userStore } from '@/stores/userStore'
const store = userStore()

</script>
<template>
    <v-app>
        <div class="d-flex align-center justify-center" style="height: 100vh">
            <v-card class="mx-auto sheet-style" height="300px" color="teal-accent-2">
                <v-card-title> Login </v-card-title>
                <v-sheet width="400" class="mx-auto">
                    <v-form>
                        <v-responsive class="mx-auto pt-3" max-width="344">
                            <v-text-field prepend-icon="mdi-account-check" label="Email" color="teal-lighten-1"
                                type="email" v-model="store.login.email"></v-text-field>
                        </v-responsive>
                        <v-responsive class="mx-auto pt-3" max-width="344">
                            <v-text-field prepend-icon="mdi-lock" label="Password" color="teal-lighten-1"
                                type="password" v-model="store.login.password"></v-text-field>
                        </v-responsive>
                        <v-row>
                            <v-col>
                                <p id="error-span">{{ store.error }}</p>
                            </v-col>
                        </v-row>
                        <v-btn block class="mt-2" @click="store.signIn" color="teal-darken-4">Sign In</v-btn>
                    </v-form>
                </v-sheet>
            </v-card>
        </div>
    </v-app>
</template>
<style scoped>
.greetings h1,
.greetings h3 {
  text-align: center;
}

#error-span {
  color: red;
  margin-left: 2%;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>