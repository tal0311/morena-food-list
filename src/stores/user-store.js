import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { useAppStore } from "@/stores/app-store";
import { userService } from "@/services/user.service";


export const useUserStore = defineStore("user", () => {
  const appStore = useAppStore();


  const currLang = ref("en");
  const loggedUser = ref(userService.getLoggedInUser())

  const getUser = computed(() => loggedUser.value)
  const getCurrLang = computed(() => currLang.value)

  watchEffect(() => {
    // console.log("loggedUser", loggedUser.value);
  });


  async function login(loginType, credentials) {
    try {
      loggedUser.value = await userService.login(loginType, credentials);
      if (!loggedUser.value) return
      setLang(loggedUser.value.settings.lang);

      return
    } catch (error) {
      console.error("error", error);
    }

  }

  async function signup(credentials) { }

  async function logout() { }

  function loadUser() {
    loggedUser.value = userService.getLoggedInUser();
    if (!loggedUser.value) return;
    setLang(loggedUser.value.settings.lang);
  }

  async function updateLoggedUser(user) {
    const userToUpdate = { ...loggedUser.value, ...user };
    loggedUser.value = await userService.save(userToUpdate);
  }

  async function updateUserItems(items) {
    loggedUser.value.selectedItems = items;
    // console.log('loggedUser.value', loggedUser.value);
    loggedUser.value = await userService.save(loggedUser.value);
  }

  async function updateUser(key, value) {

    // console.trace()
    // console.log("updating user in store");

    try {


      loggedUser.value = { ...JSON.parse(JSON.stringify(loggedUser.value)), [key]: value };
      const user = await userService.save(loggedUser.value);
      console.log('user after', user);
      // loggedUser.value = user

      if (key === 'settings') {
        setLang(value);
      }


    } catch (error) {
      console.error(error);
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
    updateLoggedUser,
    setLang,
    getCurrLang,
    addHistory,
    login,

    loadUser,
    updateUserItems,


  }
})
