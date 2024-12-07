import { addClassById, getParameterByName, globalConfig, responseToastConfig, signOut } from './globalQuote';
import { App } from 'vue';

const globalQuotePlugin = {
    install: function (app: App) {
        app.config.globalProperties.$responseToastConfig = responseToastConfig;
        app.config.globalProperties.$addClassById = addClassById;
        app.config.globalProperties.$globalConfig = globalConfig;
        app.config.globalProperties.$getParameterByName = getParameterByName;
        app.config.globalProperties.$signOut = signOut;
    }
};

export default globalQuotePlugin;
