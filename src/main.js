import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import i18nPlugin from "./plugins/i18nPlugin";
import svgPlugin from "./plugins/svgPlugin";
import errorPlugin from './plugins/errorPlugin'
import vue3GoogleLogin from 'vue3-google-login'
import bugLoggerPlugin from './plugins/bugLoggerPlugin'
import { i18Service } from "./services/i18n.service";

// this is for getting the app translations before the app is mounted
(async () => {
  try {
    
    // מחכים לטעינת קבצי ה-CSS החיצוניים
    // await waitForExternalCSS();
    
    await i18Service.init();
    const app = createApp(App);

    // Libraries
    app.use(createPinia());
    app.use(router);

    app.use(vue3GoogleLogin, {
      clientId: import.meta.env.VITE_G_CLIENT_ID

    })
    // Plugins
    app.use(i18nPlugin);
    app.use(svgPlugin);
    app.use(errorPlugin);

    if (import.meta.env.MODE === 'development') {
      app.use(bugLoggerPlugin);
    }
    
    app.mount("#app");
  } catch (error) {
    console.error("❌ שגיאה בטעינת האפליקציה:", error);
  }
})();



