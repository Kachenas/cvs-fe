<script setup>
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2';
import { writeFile, utils } from "xlsx";

import { useGroupAdminStore } from '../../stores/GroupAdminStore/groupAdminStore'
const store = useGroupAdminStore()

const currentPage = ref(1);
const rowsPerPage = 5;

const totalRows = computed(() => store.getUsers.length);

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return store.getUsers.slice(startIndex, endIndex);
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

onMounted(async () => {
    await store.showUserGroup()
    await store.showUnallocatedUser()
    await store.showGroups();
})

const showDiv = ref('div1') //visibility of div

const removeUserConfirmation = (name, userId, groupId) => {
    console.log(name, userId, groupId);
    Swal.fire({
        title: 'Remove User from Group',
        text: `User ${name} will be remove to this Group!`,
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            store.removeUserGroup(userId, groupId)
            Swal.fire({
                title: 'User is Remove!',
                text: 'The user is remove to this group!',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    reloadTableRemoveUser();
                }
            });
        }
    });
};

const assignUserConfirmation = (name, userId) => {

    const groups = store.getAvailableGroups;

    const sweetAlertInputOptions = {};
    groups.forEach(({ id, group_name }) => {
        sweetAlertInputOptions[id] = group_name;
    });

    Swal.fire({
        title: 'Assign User Group',
        text: `User ${name} will be assign to your chosen Group!`,
        icon: 'warning',
        input: 'select',
        inputPlaceholder: 'Select a Group',
        inputOptions: sweetAlertInputOptions,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedGroupId = result.value;
            store.assignUserGroup(userId, selectedGroupId);
            Swal.fire({
                title: 'User Assigned!',
                text: 'The user is now assign to a group!',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    reloadTableAssignUserGroup();
                    reloadTableRemoveUser();
                }
            });
        }
    });
}

const reloadTableAssignUserGroup = () => {
    store.showUnallocatedUser();
};

const reloadTableRemoveUser = () => {
    store.showUserGroup();
}

const exportDataToExcel = () => {
    // Convert the data array to a format that SheetJS can handle (array of arrays)
    const dataArray = store.getUsers.map(item => [item.full_name, item.voucher_code]);

    // Create a new workbook and worksheet
    const worksheet = utils.json_to_sheet(dataArray);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    utils.sheet_add_aoa(worksheet, [["Full Name", "Voucher"]], { origin: "A1" });
    writeFile(workbook, "voucher.xlsx", { compression: true });
}
</script>
<template>
    <div class="main">
        <h3>What would you like to do?</h3>
        <v-row>
            <v-col cols="6" xs="12" md="6">
                <v-btn block class="mt-2" @click="showDiv = 'div1'" color="teal-lighten-1">Assign User</v-btn>
            </v-col>
            <v-col cols="6" xs="12" md="6">
                <v-btn block class="mt-2" @click="showDiv = 'div2'" color="teal-lighten-1">Show User</v-btn>
            </v-col>
        </v-row>
        <div class="container-main">
            <div v-if="showDiv === 'div1'">
                <div class="container">
                    <div class="center-table">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th class="th-number">#</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(unallocatedUser, index) in store.getUnallocatedUsers"
                                    :unallocatedUser="unallocatedUser.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ unallocatedUser.first_name }}</td>
                                    <td>{{ unallocatedUser.middle_name }}</td>
                                    <td>{{ unallocatedUser.last_name }}</td>
                                    <td>{{ unallocatedUser.email }}</td>
                                    <td><v-btn block class="mt-2"
                                            @click="assignUserConfirmation(unallocatedUser.first_name, unallocatedUser.id)"
                                            color="teal-accent-2">Assign User</v-btn></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="showDiv === 'div2'">
                <div class="container">
                    <div class="center-table">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th class="th-number">#</th>
                                    <th>Full Name</th>
                                    <th>Voucher Code</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- <tr v-for="(row, index) in paginatedData" :key="row.id"> -->
                                <tr v-for="(row, index) in paginatedData" :key="index">
                                    <td>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</td>
                                    <td>{{ row.full_name }}</td>
                                    <td>{{ row.voucher_code }}</td>
                                    <td>
                                        <div v-if="row.group_id === null || row.group_id === 0">
                                            <p>User has no Group</p>
                                        </div>
                                        <div v-else>
                                            <v-btn block class="mt-2"
                                                @click="removeUserConfirmation(row.full_name, row.id, row.group_id)"
                                                color="red-accent-3">Remove User</v-btn>
                                        </div>
                                    </td>
                                </tr>
                                <!-- <tr v-for="(user, index) in store.getUsers" :user="user.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ user.full_name }}</td>
                                    <td>{{ user.voucher_code }}</td>
                                    <td><v-btn block class="mt-2"
                                            @click="removeUserConfirmation(user.full_name, user.id, user.group_id)"
                                            color="red-accent-3">Remove User</v-btn></td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                    <v-row>
                        <v-col cols="12" md="3" lg="3">
                            <v-btn block class="mt-2" @click="exportDataToExcel" color="teal-darken-4">Export to
                                Excel</v-btn>
                        </v-col>
                        <v-col cols="12" md="5" lg="5"></v-col>
                        <v-col cols="2">
                            <v-btn block class="mt-2" @click="prevPage">
                                <v-icon color="indigo-accent-4" icon="mdi-less-than" size="x-large"></v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="2">
                            <v-btn block class="mt-2" @click="nextPage">
                                <v-icon color="indigo-accent-4" icon="mdi-greater-than" size="x-large"></v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
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
    max-width: 800px;
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
</style>