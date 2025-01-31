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

// -------------------------------
// 关键操作：修改挂载点元素
// -------------------------------
const rootElement = document.getElementById('app');
if (rootElement) {
    // 添加类名
    rootElement.classList.add('sm:h-dvh');
    rootElement.classList.add('sm:overflow-hidden');
}

app.mount('#app');
