<script setup>
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2';
import { writeFile, utils  } from "xlsx";

import { useRegularUserStore } from '../../stores/RegularUserStore/regularStore'
const store = useRegularUserStore()

const currentPage = ref(1);
const rowsPerPage = 5;

const totalRows = computed(() =>  store.getVouchers.length);

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return store.getVouchers.slice(startIndex, endIndex);
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

onMounted(async() => {
  await store.showVoucher();
})

const deleteVoucher = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this voucher!',
    icon: 'warning',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {

      store.deleteVoucher(id)

      Swal.fire({
        title: 'Deleted!',
        text: 'The voucher has been deleted.',
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          reloadTable();
        }
      });
    }
  });
}

const generateVoucher = () => {
  if (store.getVouchers.length < 10) {
    Swal.fire({
      title: 'Generating Voucher!',
      text: 'A moment while we generate a Voucher for you.',
      icon: 'success',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        store.generateVoucher()
        reloadTable();
      }
    });
  } else {

    Swal.fire({
      title: 'Voucher Generation',
      text: 'Cannot generate Voucher!Max of 10 Voucher reached!',
      icon: 'warning',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        store.generateVoucher()
        reloadTable();
      }
    });

  }

}

const maxVoucherReached = computed(() => {
  if (store.maxVoucher) {
    return 'Only a maximum of 10 vouchers can be generated!';
  } else {
    return 'Generated Voucher Code: ' + store.getVouchers.length;
  }
});

const reloadTable = () => {
  store.showVoucher();
}

const exportDataToExcel = () => {
   // Convert the data array to a format that SheetJS can handle (array of arrays)
  const dataArray = store.getListVouchers.map(item => [item.full_name, item.voucher_code]);

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
    <v-row>
      <v-col cols="12" sm="4" lg="4">
        <v-btn block class="mt-2" @click="generateVoucher" color="teal-darken-4">Generate Voucher</v-btn>
      </v-col>
      <v-col cols="12" sm="5" lg="5"></v-col>
      <v-col cols="12" sm="3" lg="3">
        <v-btn block class="mt-2" @click="exportDataToExcel" color="teal-darken-4">Export to Excel</v-btn>
      </v-col>
    </v-row>
    <div class="error-voucher">
      <h4>{{ maxVoucherReached }}</h4>
    </div>
    <div class="container">
      <div class="center-table">
        <table class="voucher-table">
          <tr>
            <th class="th-number">#</th>
            <th>Full Name</th>
            <th>Vouchers</th>
            <th>Action</th>
          </tr>
          <tbody>
            <!-- <tr v-for="(row, index) in paginatedData" :key="'regularComponent' + row.id"> -->
            <tr v-for="(row, index) in paginatedData" :key="index">
              <td>{{  (currentPage - 1) * rowsPerPage + index + 1 }}</td>
              <td>{{ row.full_name }}</td>
              <td>{{ row.voucher_code }}</td>
              <td>
                <v-row>
                  <v-col cols="6">
                    <v-btn block class="mt-2" @click="deleteVoucher(row.id)">
                      <v-icon color="red-accent-4" icon="mdi-eraser" size="x-large"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
            <!-- <tr v-for="(voucher, index) in store.getListVouchers" :key="voucher.id">
              <td>{{ index + 1 }}</td>
              <td>{{ voucher.full_name }}</td>
              <td>{{ voucher.voucher_code }}</td>
              <td>
                <v-row>
                  <v-col cols="6">
                    <v-btn block class="mt-2" @click="deleteVoucher(voucher.id)">
                      <v-icon color="red-accent-4" icon="mdi-eraser" size="x-large"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr> -->
          </tbody>
        </table>
        <div>
          <v-row>
            <v-col cols="8"></v-col>
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
.container {
  max-width: 100%;
  margin-left: 5%;
  margin-top: 1%;
  padding: 5%;
}

.center-table {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.voucher-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
}

.voucher-table th {
  background-color: #009688;
}

.voucher-table tbody tr:nth-child(even) {
  background-color: #80deea;
}

.voucher-table tbody tr:hover {
  background-color: #f1f1f1;
}

.voucher-table th,
.voucher-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.error-voucher {
  color: red;
  padding: 0.2%;
}
</style>