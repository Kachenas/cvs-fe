import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from './pinia.js';

import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//sweetAlert
// import SweetAlertPlugin from './utilities/sweetalert';

const vuetify = createVuetify({
    components,
    directives,
})

import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
// app.use(SweetAlertPlugin);

app.mount('#app')
