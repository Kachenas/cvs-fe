<script setup>
import Swal from 'sweetalert2';
import router from '../router/index';

import { userStore } from '../stores/userStore';
const store = userStore()

const register = () => {

  if(
    (store.login.first_name === '') || 
    (store.login.middle_name === '') ||
    (store.login.last_name === '') ||
    (store.login.email === '') ||
    (store.login.password === '') ||
    (store.login.verify_pasword === '')
  ) {
    Swal.fire({
        title: 'Error Signing Up!',
        text: 'Please fill out All fields!',
        icon: 'info',
        allowOutsideClick: false,
      })
  } else {
    
    if (!isValidEmail(store.login.email)) {
      Swal.fire({
        title: 'Error Signing Up!',
        text: 'Enter a valid Email address!',
        icon: 'info',
        allowOutsideClick: false,
      })
    } else {
      if (store.login.password !== store.login.verify_pasword) {
        Swal.fire({
          title: 'Error Signing Up!',
          text: 'Password and Verify password are not the same!',
          icon: 'info',
          allowOutsideClick: false,
        })
      } else {
        store.register();
        if(store.can_logged) {
          Swal.fire({
            title: 'Congratulations, you are now registered!',
            text: 'Please logged in to enter the website!',
            icon: 'warning',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.login.password = '';
              this.login.email  = '';
              router.push('/');
            }
          });
        }
        
      }
    }
    
  }

}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}



</script>
<template>
   <v-app>
      <div class="login-bg">
          <div class="d-flex align-center justify-center" style="height: 100vh">
            <v-card class="mx-auto sheet-style" color="teal-accent-2">
              <v-card-title> Register </v-card-title>
  
              <v-sheet width="400" class="mx-auto">
                <v-form @submit.prevent="register">
                <v-responsive
                  class="mx-auto pt-3" 
                  max-width="344"
                >
                  <v-text-field
                    label="First Name"
                    color="teal-lighten-1"
                    type="text"
                    v-model="store.login.first_name"
                  ></v-text-field>
                </v-responsive>

                <v-responsive
                  class="mx-auto pt-3" 
                  max-width="344"
                >
                  <v-text-field
                    label="Middle Name"
                    color="teal-lighten-1"
                    type="text"
                    v-model="store.login.middle_name"
                  ></v-text-field>
                </v-responsive>

                <v-responsive
                  class="mx-auto pt-3" 
                  max-width="344"
                >
                  <v-text-field
                    label="Last Name"
                    color="teal-lighten-1"
                    type="text"
                    v-model="store.login.last_name"
                  ></v-text-field>
                </v-responsive>

                <v-responsive
                  class="mx-auto pt-3" 
                  max-width="344"
                >
                  <v-text-field
                    label="Email"
                    color="teal-lighten-1"
                    type="email"
                    v-model="store.login.email"
                  ></v-text-field>
                </v-responsive>

                <v-responsive
                  class="mx-auto pt-3" 
                  max-width="344"
                >
                  <v-text-field
                    label="Password"
                    color="teal-lighten-1"
                    type="password"
                    v-model="store.login.password"
                  ></v-text-field>
                </v-responsive>

                <v-responsive
                  class="mx-auto pt-3" 
                  max-width="344"
                >
                  <v-text-field
                    label="Confirm Password"
                    color="teal-lighten-1"
                    type="password"
                    v-model="store.login.verify_pasword"
                  ></v-text-field>
                </v-responsive>
                  <div class="error-fields">
                    <p>{{ store.error }}</p>
                  </div>
                  <v-btn block class="mt-2" @click.prevent="register" color="teal-darken-4">Sign Up</v-btn>
                </v-form>
              </v-sheet>
            </v-card>
          </div>
      </div>
      
    </v-app>
</template>
<style scoped>
.error-fields {
  color: red;
  padding: 0.2%;
  text-align: center;
}
</style>