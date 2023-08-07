import { defineStore } from 'pinia'
import api from '../interceptor/api'
import router from '../router/index'
import { ref } from 'vue';


export const userStore = defineStore("user", {
  state: () => ({
    login: {
      first_name: ref(''),
      middle_name: ref(''),
      last_name: ref(''),
      email: ref(''),
      password: ref(''),
      verify_password: ref('')
    },
    authUser: ref(null),
    drawer: false,
    error: ref(null),
    isAuthenticated: false,
    userRole: ref(null),
    token: null,
    can_logged: ref(false)
  }),
  persist: {
    storage: sessionStorage,
    key: 'my_app_state',
  },
  actions : {
    setAuthUser(user) {
      this.authUser = user;
    },
    async signIn (e) {
      e.preventDefault();
      const payload = {
        email: this.login.email,
        password: this.login.password,
      }
      
       //start
       try {

        const response = await api.post('/user/login', payload, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        if (response.data.code === 200 && typeof response.data.result === 'string') {
          this.error = response.data.result;
          this.login.password = '';
          this.login.email  = '';
        } else {

          this.authUser = response.data.result;
          if (response.data.result && response.data.result.user_role) {
            this.setAuthUser(response.data.result);
            this.isAuthenticated = true;
            this.userRole = response.data.result.user_role;
            this.token = response.data.result.token;
            this.isAuthenticated = true;
            this.login.password = '';
            this.login.email  = '';
            this.error = '';
            this.drawer = true;
            await router.push('/main');
          }
          
        }

        this.setAuthUser(response.data.result);
        this.isAuthenticated = true;
        this.userRole = response.data.result.user_role;
        this.token = response.data.result.token;
        this.isAuthenticated = true;
        this.login.password = '';
        this.login.email  = '';
        this.error = '';
        this.drawer = true;
        await router.push('/main');
       
      } catch (error) {

        if (error.response) {
          this.error = error.response.data.message;
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          this.error = "No response from the server";
        } else {
          // Something else happened while setting up the request
          console.log('Error', error.message);
          this.error = error.message;
        }
      }
      
      //end
    },
    async register () {

      const payload = {
        first_name: this.login.first_name,
        middle_name: this.login.middle_name,
        last_name: this.login.last_name,
        email: this.login.email,
        password: this.login.password
      }

      try {

        const response = await api.post('/user/register', payload, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        
        const { code, message } = response.response.data;
        
        if (code === 200) {
          this.error = '';
          this.login = {};
        } else {
          this.login = {};
          this.error = message;
        }

      } catch (error) {
        this.error = error.response;
      }

      this.can_logged = true;
      await router.push('/');
    },
    async logout () {
      localStorage.clear();
      this.$reset();
      this.isAuthenticated = false
      this.userRole = null;
      this.token = null;
      this.isAuthenticated = false
      this.authUser = null
      await router.push('/');
    }
  }
});