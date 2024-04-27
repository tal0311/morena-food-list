import { i18Service } from "@/services/i18n.service";
import { useListStore } from "@/stores/list-store";

export default {
  install: (app) => {
    // inject a globally available $translate() method
    const listStore = useListStore();
    app.config.globalProperties.$trans = (key) => {
      key = key.toLowerCase()
      const lang = listStore.getCurrLang;
      return i18Service.doTrans(key, lang);
    };
  },
};
