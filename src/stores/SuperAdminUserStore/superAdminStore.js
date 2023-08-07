import { defineStore } from 'pinia'
import api from '../../interceptor/api'
import { userStore } from '../../stores/userStore'
import { ref } from 'vue'


export const useSuperAdminStore = defineStore('superAdmin', {
  state: () => ({
    group_name: ref(null),
    group_email: ref(null),
    group_id: ref(null),
    showDiv: null,
    getUnallocatedUsers: ref([]),
    getAllUsers: ref([]),
    getAllAdmins: ref([]),
    getAllGroups: ref([]),
    getAllUserAdmins: ref([]),
    group: {},
    token: null,
  }),
  getters: {
    getAvailableGroups(state) {
      return state.getAllGroups.map(({ id, group_name }) => ({ id, group_name }));
    },
    getAvailableAdmins(state) {
      return state.getAllUserAdmins.map(({ id, assign_admin }) => ({ id, assign_admin }));
    },
    getUnallocatedAvailableUsers(state) {
      return state.getUnallocatedUsers.map(({ id, first_name, middle_name, last_name }) => ({id,full_name: `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`,}));
    }
  },
  actions: {
    async viewUsers() {
      const user = userStore()
      try {
        const response = await api.post('/super-admin/view-users', null, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        this.getAllUsers = response.data.result
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async viewUnallocatedUsers() {
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
    async viewGroupAdmins() {
      const user = userStore()
      try {
        const response = await api.post('/super-admin/view-group-admin', null, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        this.getAllAdmins = response.data.result
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async viewAdmins() {
      const user = userStore()
      try {
        const response = await api.post('/super-admin/view-admins', null, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        this.getAllUserAdmins = response.data.result
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async assignUserGroup() {
      console.log("this will assisgn users to group");
      // const user = useGroupAdminStore()
      // this.getUnallocatedUsers = user.showUnallocatedUser();
      // console.log("This is for assigning user to a group");
    },
    async viewGroups() {
      const user = userStore()
      try {
        const response = await api.post('/super-admin/view-groups', null, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        this.getAllGroups = response.data.result
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async removeUserGroup(user_id, group_id) {
      const user = userStore()

      const payload = {
        user_id: user_id,
        group_id: group_id
      }

      try {
        const response = await api.post('/group-admin/remove-user-group', payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        console.log(response)
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async assignAdminGroup(userId,groupId) {

      const user = userStore()

      const payload = {
        user_id: userId,
        group_id: groupId
      }

      try {
        const response = await api.post('/super-admin/assign-admin-group', payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })

        console.log(response);

      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async assignGroupAdmin(userId,groupId) {

      const user = userStore()

      const payload = {
        user_id: userId,
        group_id: groupId
      }

      try {
        const response = await api.post('/super-admin/assign-admin-group', payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })

        console.log(response);

      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }

      
    },
    async createGroup(groupName, groupAdminId, email) {
      const user = userStore()
      const payload = {
        group_name: groupName,
        group_admin_id: groupAdminId,
        email: email
      }

      try {
        const response = await api.post('/super-admin/create-group', payload, {
          headers: {
           "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token
          }
        })
        console.log(response)
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async updateGroup(id, group_name, group_admin_id, email) {
      const user = userStore()
      const payload = {
        id: id,
        group_name: group_name,
        group_admin_id: group_admin_id,
        email: email
      }

      try {
        const response = await api.post('/super-admin/update-group', payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        console.log(response)
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    },
    async deleteGroup(id) {
      const user = userStore()
      const payload = {
        id: id
      }

      try {
        const response = await api.post('/super-admin/delete-group', payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token
          }
        })
        console.log(response)
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.message
        } else if (error.request) {
          console.log(error.request)
          this.error = 'No response from the server'
        } else {
          console.log('Error', error.message)
          this.error = error.message
        }
      }
    }
  }
})
