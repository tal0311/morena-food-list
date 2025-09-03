import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/app-store";
import { userService } from "@/services/user.service";
import { showErrorMsg, showSuccessMsg } from "@/services/event-bus.service";

export const useUserStore = defineStore("user", () => {
  const appStore = useAppStore();


  const currLang = ref("he");
  const loggedUser = ref(null);
  const getUser = computed(() => loggedUser?.value);

  async function login(loginType, credentials) {
    try {
      loggedUser.value = await userService.login(loginType, credentials);
      if (!loggedUser.value) return;
      setLang(loggedUser.value.settings.lang);
      return loggedUser.value;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  async function logout() {
    await userService.logout();
    loggedUser.value = null;
    showSuccessMsg("logout");
  }

  async function loadUser() {
    try {
      
      loggedUser.value = userService.getLoggedInUser();
    
      if (!loggedUser.value) {
        
        return
      }
      setLang(loggedUser.value.settings.lang);
      
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async function updateLoggedUser(user) {
    console.log('updateLoggedUser', user);
    const userToUpdate = { ...loggedUser.value, ...user };
    loggedUser.value = await userService.save(userToUpdate);
  }

  async function updateUser(key, value) {
    try {
      loggedUser.value = { ...JSON.parse(JSON.stringify(loggedUser.value)), [key]: value };
      const user = await userService.save(loggedUser.value);
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
    addHistory,
    login,
    logout,
    loadUser,
    currLang
  }
})
