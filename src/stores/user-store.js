import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/app-store";
import { userService } from "@/services/user.service";

export const useUserStore = defineStore("user", () => {
  const appStore = useAppStore();


  const currLang = ref("he");
  const loggedUser = ref(null);

  const getUser = computed(() => loggedUser?.value)
  const getCurrLang = computed(() => currLang.value)

  async function login(loginType, credentials) {
    try {
      loggedUser.value = await userService.login(loginType, credentials);
      if (!loggedUser.value) return
      setLang(loggedUser.value.settings.lang);
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

  async function updateUser(key, value) {
    try {
      loggedUser.value = { ...JSON.parse(JSON.stringify(loggedUser.value)), [key]: value };
      const user = await userService.save(loggedUser.value);
      // console.log('user after', user);
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
    // updateUserItems,


  }
})
