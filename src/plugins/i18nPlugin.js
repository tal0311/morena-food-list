import { i18Service } from "@/services/i18n.service";
import { useUserStore } from "@/stores/user-store";

// import { useListStore } from "@/stores/list-store";

export default {
  install: (app ) => {
    // inject a globally available $translate() method
    const userStore = useUserStore();
    app.config.globalProperties.$trans = (key) => {
      if (!key) return ;
      key = key.toLowerCase()
      const lang = userStore.getCurrLang;
      return i18Service.doTrans(key, lang);
    };
  },
};
