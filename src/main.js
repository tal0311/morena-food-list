import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import i18nPlugin from "./plugins/i18nPlugin";
import svgPlugin from "./plugins/svgPlugin";

const app = createApp(App);

// Libraries
app.use(router);
app.use(createPinia());

// Plugins
app.use(i18nPlugin);
app.use(svgPlugin);

app.mount("#app");

import { useAppStore } from "./stores/app-store";
const appStore = useAppStore();
window.onerror = (err) => {
  appStore.logError(err);
};
