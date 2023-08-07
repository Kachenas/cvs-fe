import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate, {
    key: 'my_app_state',
});