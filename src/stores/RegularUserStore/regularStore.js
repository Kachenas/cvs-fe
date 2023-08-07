import { defineStore } from 'pinia' 
import { ref } from 'vue'
import api from '../../interceptor/api'
import { userStore } from '../../stores/userStore';

export const useRegularUserStore = defineStore("useRegularUserStore", {
  state: () => ({
    maxVoucher: false,
    getVouchers: ref([]),
    token: null,
    searchTerm: null
  }),
  getters: {
    getListVouchers(state) {
      return state.getVouchers
    }
  },
  actions: {

    async generateVoucher() {

      const user = userStore()

      try {

        const response = await api.post("/regular-user/generate", null, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          },
        });
       
        let maxCount = this.getVouchers.length;
        if (maxCount >= 10) {
          this.maxVoucher = true;
        }
        
      } catch (error) {
        
        if (error.response) {
          this.error = error.response.data.message;
        } else if (error.request) {
          console.log(error.request);
          this.error = "No response from the server";
        } else {
          console.log('Error', error.message);
          this.error = error.message;
        }

      }
      
    },
    async showVoucher() {

      const user = userStore()

      try {

        const response = await api.post("/regular-user/show", null, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          },
        });

        this.getVouchers = response.data.result;
       
        
      } catch (error) {
        
        if (error.response) {
          this.error = error.response.data.message;
        } else if (error.request) {
          console.log(error.request);
          this.error = "No response from the server";
        } else {
          console.log('Error', error.message);
          this.error = error.message;
        }

      }
    
    },
    async deleteVoucher(id) {
      const user = userStore()

      const payload = {
        id: id
      }

      try {

        const response = await api.post("/regular-user/delete", payload, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          },
        });

        //console.log(response.data.result);
        
      } catch (error) {
        
        if (error.response) {
          this.error = error.response.data.message;
        } else if (error.request) {
          console.log(error.request);
          this.error = "No response from the server";
        } else {
          console.log('Error', error.message);
          this.error = error.message;
        }

      }

    }
  },
});