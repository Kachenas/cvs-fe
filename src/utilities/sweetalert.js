import { createApp } from 'vue';
import Swal from 'sweetalert2';

const SweetAlertPlugin = {
  install(app) {
    app.config.globalProperties.$swal = Swal;
  },
};

export default SweetAlertPlugin;