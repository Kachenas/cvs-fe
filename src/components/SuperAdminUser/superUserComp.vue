<script setup>
import Swal from 'sweetalert2';
import { onMounted, ref, computed } from 'vue'
import { useSuperAdminStore } from '../../stores/SuperAdminUserStore/superAdminStore'
import { writeFile, utils } from "xlsx";

const store = useSuperAdminStore()

const currentPage = ref(1);
const rowsPerPage = 5;

const totalRows = computed(() => store.getAllUsers.length);

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return store.getAllUsers.slice(startIndex, endIndex);
});

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function nextPage() {
    const totalPages = Math.ceil(totalRows.value / rowsPerPage);
    if (currentPage.value < totalPages) {
        currentPage.value++;
    }
}

const showDiv = ref('div1')

//create
const showModalCreateGroup = ref(false);
const selectedOption = ref(null);
const options = ref({});
const groupID = ref(null);


//update group
const showModalUpdateGroup = ref(false);
const groupAdminID = ref(null);

//update user admin group
const showModalUpdateUserAdminGroup = ref(false);
const selectedOptionAdmin = ref(null);

//create/assign user
const showCreateUserModal = ref(false);
const selectedOptionUser = ref(null);
const selectedOptionGroup = ref(null);
const userOptions = ref({});
const groupOptions = ref({});

onMounted(async () => {
    await store.viewUsers()
    await store.viewGroupAdmins()
    await store.viewAdmins()
    await store.viewGroups()
    await store.viewUnallocatedUsers()
})
// createAssignUserGroup
const assignUsersGroup = () => {
    showCreateUserModal.value = true;
    userOptions.value = store.getUnallocatedAvailableUsers;
    groupOptions.value = store.getAvailableGroups;
}

const createAssignUserGroup = () => {
    showCreateUserModal.value = false;
    const userID = selectedOptionUser.value;
    const groupID = selectedOptionGroup.value;
    Swal.fire({
        title: 'Assign User to Group',
        text: "This will assign user to a group!",
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.assignGroupAdmin(userID, groupID)
            Swal.fire({
                title: 'Succesfully Added User!',
                text: 'The user is now added to the group!',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    reloadTableUsers();
                }
            });
        }
    });
}
const removeUsersGroup = (user, group) => {
    const userId = user;
    const groupID = group;
    Swal.fire({
        title: 'Remove User to Group',
        text: "This will remove user to his/her assign group!",
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.removeUserGroup(userId, groupID)
            Swal.fire({
                title: 'Succesfully Remove User!',
                text: 'The user is now remove to the group!',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    reloadTableUsers();
                }
            });
        }
    });
}

const reloadTableUsers = () => {
    store.viewUsers();
}

const editUserAdmin = (groupID) => {
    showModalUpdateUserAdminGroup.value = true;
    options.value = store.getAvailableAdmins;
    groupAdminID.value = groupID;
}

const updateAdminConfirmGroup = () => {
    showModalUpdateUserAdminGroup.value = false;
    const group_admin = selectedOptionAdmin.value;
    const group_id = groupAdminID.value;
    console.log("The user id selected is " + group_admin + " the group ID selected is " + group_id);
    Swal.fire({
        title: 'Update Admin from Group',
        text: 'This will update the admin in this group',
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.assignAdminGroup(group_admin, group_id);
            reloadTableViewGroups();
        }
    });
}

const deleteGroup = (groupId, groupName) => {
    Swal.fire({
        title: 'Delete Group',
        text: `User Group: ${groupName}\n will be remove!`,
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.deleteGroup(groupId);
            reloadTableViewGroups();
        }
    });
}

const createGroup = () => {
    showModalCreateGroup.value = true;
    options.value = store.getAvailableAdmins;
}

const createConfirmGroup = () => {

    const group_name = store.group_name;
    const group_email = store.group_email;
    const group_admin = selectedOption.value;
    showModalCreateGroup.value = false;
    Swal.fire({
        title: 'Create Group',
        text: 'A new Group will be created',
        icon: 'success',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.createGroup(group_name, group_admin, group_email)
            reloadTableViewGroups()
        }
    });

}

const updateGroup = (id) => {
    groupID.value = id;
    showModalUpdateGroup.value = true;
    options.value = store.getAvailableAdmins;
}

const updateConfirmGroup = () => {
    const group_id = groupID.value;
    const group_name = store.group_name;
    const group_email = store.group_email;
    const group_admin_id = selectedOption.value;
    showModalUpdateGroup.value = false;

    Swal.fire({
        title: 'Update Group',
        text: 'The information of this group will be updated!',
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.updateGroup(group_id, group_name, group_admin_id, group_email)
            reloadTableViewGroups();
            reloadTableViewGroupAdmins();
        }
    });
}

const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

const reloadTableViewGroups = () => {
    store.viewGroups()
}

const reloadTableViewGroupAdmins = () => {
    store.viewGroupAdmins();
}

const exportDataToExcel = () => {
    // Convert the data array to a format that SheetJS can handle (array of arrays)
    const dataArray = store.getAllUsers.map(item => [item.full_name, item.voucher_code]);

    // Create a new workbook and worksheet
    const worksheet = utils.json_to_sheet(dataArray);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    utils.sheet_add_aoa(worksheet, [["Full Name", "Voucher"]], { origin: "A1" });
    writeFile(workbook, "voucher.xlsx", { compression: true });
}

</script>
<template>
    <div>
        <h3>What would you like to do?</h3>
        <v-row>
            <v-col cols="4" xs="12" md="4">
                <v-btn block class="mt-2" @click="showDiv = 'div1'" color="teal-lighten-1">Users</v-btn>
            </v-col>
            <v-col cols="4" xs="12" md="4">
                <v-btn block class="mt-2" @click="showDiv = 'div2'" color="teal-lighten-1">Admins</v-btn>
            </v-col>
            <v-col cols="4" xs="12" md="4">
                <v-btn block class="mt-2" @click="showDiv = 'div3'" color="teal-lighten-1">Groups</v-btn>
            </v-col>
        </v-row>

        <div class="container-main">
            <div v-if="showDiv === 'div1'">
                <div class="container">
                    <div class="center-table">
                        <table class="custom-table" style="height: 300px;">
                            <thead>
                                <tr>
                                    <th class="th-number">#</th>
                                    <th>Full Name</th>
                                    <th>Voucher</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in paginatedData" :key="index">
                                    <td>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</td>
                                    <td>{{ row.full_name }}</td>
                                    <td>{{ row.voucher_code }}</td>
                                    <td>
                                        <v-btn block class="mt-2"
                                            @click="removeUsersGroup(row.id, row.group_id)"
                                            color="red-accent-3">Remove User</v-btn>
                                    </td>
                                </tr>
                                <!-- <tr v-for="(getAllUsers, index) in store.getAllUsers" :getAllUsers="getAllUsers.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ getAllUsers.full_name }}</td>
                                    <td>{{ getAllUsers.voucher_code }}</td>
                                    <td><v-btn block class="mt-2"
                                            @click="removeUsersGroup(getAllUsers.id, getAllUsers.group_id)"
                                            color="red-accent-3">Remove User</v-btn></td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <v-row>
                    <v-col cols="8" md="8" lg="8"></v-col>
                    <v-col cols="2" md="2" lg="2">
                        <v-btn block class="mt-2" @click="prevPage">
                            <v-icon color="indigo-accent-4" icon="mdi-less-than" size="x-large"></v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="2" md="2" lg="2">
                        <v-btn block class="mt-2" @click="nextPage">
                            <v-icon color="indigo-accent-4" icon="mdi-greater-than" size="x-large"></v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="3" lg="3">
                        <v-btn block class="mt-2" @click="exportDataToExcel" color="teal-darken-4">Export to
                            Excel</v-btn>
                    </v-col>
                    <v-col cols="12" md="5" lg="5"></v-col>
                    <v-col cols="12" md="4" lg="4">
                        <v-btn block class="mt-2" @click="assignUsersGroup()" color="teal-lighten-1">Assign Users to
                            Group</v-btn>
                    </v-col>
                </v-row>
                <!-- start of assign/ create user modal-->
                <v-dialog v-model="showCreateUserModal" class="custom-group-modal">
                    <v-card>
                        <v-card-title>
                            Assign User to Group
                        </v-card-title>
                        <v-card-text>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-select v-model="selectedOptionUser" :items="userOptions" label="Select User"
                                    item-title="full_name" item-value="id"></v-select>
                            </v-responsive>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-select v-model="selectedOptionGroup" :items="groupOptions" label="Select Group"
                                    item-title="group_name" item-value="id"></v-select>
                            </v-responsive>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="createAssignUserGroup()">Assign</v-btn>
                            <v-btn color="secondary" @click="showCreateUserModal = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- end of assign/create user modal -->
            </div>
            <div v-if="showDiv === 'div2'">
                <div class="container">
                    <div class="center-table">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th class="th-number">#</th>
                                    <th>Assign Admin</th>
                                    <th>Group Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(getAllGroups, index) in store.getAllGroups" :getAllGroups="getAllGroups.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ getAllGroups.full_name }}</td>
                                    <td>{{ getAllGroups.group_name }}</td>
                                    <td><v-btn block class="mt-2" @click="editUserAdmin(getAllGroups.id)"
                                            color="teal-accent-2">Edit Admin</v-btn></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- start of edit user admin -->
                <v-dialog v-model="showModalUpdateUserAdminGroup" class="custom-group-modal">
                    <v-card>
                        <v-card-title>
                            Update Admin
                        </v-card-title>
                        <v-card-text>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-select v-model="selectedOptionAdmin" :items="options" label="Select an option"
                                    item-title="assign_admin" item-value="id"></v-select>
                            </v-responsive>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="updateAdminConfirmGroup()">Update</v-btn>
                            <v-btn color="secondary" @click="showModalUpdateUserAdminGroup = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- end of edit user admin -->
            </div>
            <div v-if="showDiv === 'div3'">
                <div class="container">
                    <div class="center-table">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th class="th-number">#</th>
                                    <th>Admin Name</th>
                                    <th>Group Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(getAllGroups, index) in store.getAllGroups" :getAllGroups="getAllGroups.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ getAllGroups.full_name }}</td>
                                    <td>{{ getAllGroups.group_name }}</td>
                                    <td>{{ getAllGroups.email }}</td>
                                    <td>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-btn block class="mt-2" @click="updateGroup(getAllGroups.id)"
                                                    color="teal-accent-2">
                                                    <v-icon color="success" icon="mdi-square-edit-outline"
                                                        size="x-large"></v-icon>
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-btn block class="mt-2"
                                                    @click="deleteGroup(getAllGroups.id, getAllGroups.group_name)"
                                                    color="red-darken-3">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <v-row>
                    <v-col cols="4" xs="12" md="4">
                        <v-btn block class="mt-2" @click="createGroup()" color="teal-lighten-1">Create Group</v-btn>
                    </v-col>
                </v-row>
                <!-- start of create modal group-->
                <v-dialog v-model="showModalCreateGroup" class="custom-group-modal">
                    <v-card>
                        <v-card-title>
                            Create Group
                        </v-card-title>
                        <v-card-text>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-text-field label="Group Name" color="teal-lighten-1" type="text"
                                    v-model="store.group_name"></v-text-field>
                            </v-responsive>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-text-field label="Email" color="teal-lighten-1" type="email"
                                    v-model="store.group_email"></v-text-field>
                            </v-responsive>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-select v-model="selectedOption" :items="options" label="Select an option"
                                    item-title="assign_admin" item-value="id"></v-select>
                            </v-responsive>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="createConfirmGroup()">Create</v-btn>
                            <v-btn color="secondary" @click="showModalCreateGroup = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- end of create group modal -->
                <!-- start of update modal group-->
                <v-dialog v-model="showModalUpdateGroup" class="custom-group-modal">
                    <v-card>
                        <v-card-title>
                            Update Group
                        </v-card-title>
                        <v-card-text>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-text-field label="Group Name" color="teal-lighten-1" type="text"
                                    v-model="store.group_name"></v-text-field>
                            </v-responsive>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-text-field label="Email" color="teal-lighten-1" type="email"
                                    v-model="store.group_email"></v-text-field>
                            </v-responsive>
                            <v-responsive class="mx-auto pt-3" max-width="344">
                                <v-select v-model="selectedOption" :items="options" label="Select an option"
                                    item-title="assign_admin" item-value="id"></v-select>
                            </v-responsive>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="updateConfirmGroup()">Update</v-btn>
                            <v-btn color="secondary" @click="showModalUpdateGroup = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- end of update group modal -->
            </div>
        </div>
    </div>
</template>
<style scoped>
.container-main {
    max-width: 100%;
    margin-left: 5%;
    margin-top: 1%;
    padding: 5%;
}

.center-table {
    max-width: 100%;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    max-height: 430px;
    overflow-y: auto;
}

.custom-table thead {
    position: sticky;
    top: 0;
    z-index: 1;
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    margin-bottom: 20px;
}

.custom-table tbody tr:nth-child(even) {
    background-color: #80deea;
}

.custom-table tbody tr:hover {
    background-color: #f1f1f1;
}

.custom-table tr th {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    background-color: #009688;
}

.custom-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.custom-group-modal {
    width: 40%;
    margin: 0 auto;
}
</style>