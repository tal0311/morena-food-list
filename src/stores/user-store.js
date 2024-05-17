import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { useListStore} from "@/stores/list-store";
import { useAppStore } from "@/stores/app-store";
import { userService } from "@/services/user.service";


export const useUserStore = defineStore("user", () => {
  const appStore = useAppStore();

  const currLang = ref("en");
  const loggedUser = ref(null);
 

  const getUser = computed(() => loggedUser.value);
  const getCurrLang = computed(() => currLang.value);

 function loadUser(){
    loggedUser.value = userService.getLoggedInUser();

 }

 async function login(credentials) {}

  async function signup(credentials) {}

  async function logout() {}

  watchEffect(() => {
    if (loggedUser.value) {
     setLang(loggedUser.value.settings.lang);
    }
  })

async function updateLoggedUser(user) {
    loggedUser.value = { ...loggedUser.value ,...user };
     await userService.save(loggedUser.value);
  }

  async function updateUser(key, value) {
    
  try {
  
    loggedUser.value[key] = value;
    await userService.save(loggedUser.value);
  } catch (error) {
    appStore.logError(`[error: failed to update user with selected items] - ${error}`, true);
    
  }
    
  }

  function setLang(lang) {
    console.debug("setting lang", lang);
    const langOptions = ["en", "he", "es"];
    currLang.value = langOptions.includes(lang) ? lang : "en";
    document.body.setAttribute("dir", currLang.value === "he" ? "rtl" : "ltr");
  }

  return {
  loggedUser,
  updateUser,
  getUser,
  loadUser,
  updateLoggedUser,
  setLang,
  getCurrLang
  }
})
