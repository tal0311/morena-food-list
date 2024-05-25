import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { useListStore } from "@/stores/list-store";
import { useAppStore } from "@/stores/app-store";
import { userService } from "@/services/user.service";


export const useUserStore = defineStore("user", () => {
  const appStore = useAppStore();
  const listStore = useListStore();

  const currLang = ref("en");
  const loggedUser = ref(null);

  const getUser = computed(() => loggedUser.value);
  const getCurrLang = computed(() => currLang.value);

  function loadUser() {
    loggedUser.value = userService.getLoggedInUser();
  }

  async function login(loginType, credentials) {
    try {
      loggedUser.value = await userService.login(loginType, credentials);
      // console.log('UST login:', loggedUser.value);
      return
    } catch (error) {
      console.error("error", error);
    }

  }

  async function signup(credentials) { }

  async function logout() { }

  watchEffect(() => {
    if (loggedUser.value) {
      setLang(loggedUser.value.settings.lang);
    }
  })

  async function updateLoggedUser(user) {
    const userToUpdate = { ...loggedUser.value, ...user };
    loggedUser.value = await userService.save(userToUpdate);
  


  }

  async function updateUser(key, value) {

    try {
    

    
      loggedUser.value = { ...loggedUser.value, [key]: value };
      userService.save(loggedUser.value);
      

    } catch (error) {
      console.log(error);
      appStore.logError(`[error: failed to update user with selected items] - ${error}`, true);

    }

  }

  function addHistory(Log) {
    const history = loggedUser.value.history;
    history.push(Log);
    updateUser("history", history);
  }

  function setLang(lang) {
    // console.debug("setting lang", lang);
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
    getCurrLang,
    addHistory,
    login
  }
})
