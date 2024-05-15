import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { useListStore} from "@/stores/list-store";
import { useAppStore } from "@/stores/app-store";
import { userService } from "@/services/user.service";


export const useUserStore = defineStore("user", () => {
  const appStore = useAppStore();

  const loggedUser = ref(null);
 

  const getUser = computed(() => loggedUser.value);

function loadUser(){
    loggedUser.value = userService.getLoggedInUser();

    console.log(loggedUser.value);
  
 }

 async function login(credentials) {}

  async function signup(credentials) {}

  async function logout() {}

  async function updateUser(key, value) {
    console.log(key, value);
  try {
  
    loggedUser.value[key] = value;
    await userService.save(loggedUser.value);
  } catch (error) {
    appStore.logError(`[error: failed to update user with selected items] - ${error}`, true);
    
  }
    
  }
  return {
  loggedUser,
  updateUser,
  getUser,
  loadUser
  }
})
