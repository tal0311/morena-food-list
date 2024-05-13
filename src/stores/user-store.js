import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { useListStore} from "@/stores/list-store";

export const useUserStore = defineStore("user", () => {

  const loggedUser = ref(null);
 

  const getUser = computed(() => loggedUser.value);

 async function loadUser(){
    loggedUser.value = await userService.getUser();

  
 }

 async function login(credentials) {}

  async function signup(credentials) {}

  async function logout() {}

  async function updateUser(key, value) {
    loggedUser.value[key] = value;
    await userService.updateUser(loggedUser.value);
    
  }
  return {
  loggedUser,
  updateUser,
  getUser,
  loadUser
  }
})
