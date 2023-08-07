import { defineStore, setActivePinia  } from "pinia";
import api from '../../interceptor/api'
import { userStore } from '../../stores/userStore';
import { ref } from 'vue';

export const useGroupAdminStore = defineStore("groupAdmin", {
  state: () => ({
    showDiv: null,
    getUsers: ref([]),
    getUnallocatedUsers: ref([]),
    token: null,
    getGroups: []
  }),
  getters: {
    getAvailableGroups(state) {
      return state.getGroups.map(({ id, group_name }) => ({ id, group_name }));
    },
    getUnallocatedAvailableUsers(state) {
      return state.getUnallocatedUsers.map(({ id, first_name, middle_name, last_name }) => ({
        id,
        full_name: `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`,
      }));
    }
  },
  actions: {
    async assignUserGroup(user_id, group_id) {
      
      const user = userStore()

      const payload = {
        user_id: user_id,
        group_id: group_id,
      }

      try {

        const response = await api.post('/group-admin/assign-user-group', payload, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          }
        });
        console.log(response);
        
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
    async showUserGroup() {
      
      const user = userStore()

      try {

        const response = await api.post("/group-admin/show-user-group", null, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          },
        });
        this.getUsers = response.data.result;
        
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
    async removeUserGroup(user_id, group_id) {

      const user = userStore()

      const payload = {
        user_id: user_id,
        group_id: group_id,
      }

      try {

        const response = await api.post('/group-admin/remove-user-group', payload, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          }
        });
        console.log(response);
        
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
    async showUnallocatedUser() {
      
      const user = userStore()

      try {

        const response = await api.post("/group-admin/show-unallocated-user", null, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          },
        });
        this.getUnallocatedUsers = response.data.result;
        
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
    async showGroups() {
      
      const user = userStore()

      try {

        const response = await api.post("/group-admin/show-groups", null, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          },
        });
        this.getGroups = response.data.result;
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
  },
});