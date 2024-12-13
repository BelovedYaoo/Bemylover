import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from '@/service/router';

import 'agility-core/src/assets/styles.scss';
import PrimeVueImportAll from 'agility-core/src/service/PrimeVueImportAll';

const app = createApp(App);
const pinia = createPinia();

// 导入所有PrimeVue组件
PrimeVueImportAll(app);

app.use(pinia);
app.use(router);

app.mount('#app');
