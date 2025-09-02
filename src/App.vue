<template>
  <section class="main-app main-layout">
    <OfflineIndicator />
    <RouterView />
    <UserMsg />
    <AppModal />
    <BugLogger/>
    <RouterLink to="/dev" v-if="true">Dev</RouterLink>
  </section>
</template>

<script setup>
//TODO: canva info ang img
// TODO: in summary screen, show the items that by group order




import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';
import AppModal from '@/components/AppModal.vue';
import { useRouter, useRoute } from 'vue-router';
import OfflineIndicator from '@/components/OfflineIndicator.vue';

import { socketService } from './services/socket.service';
import BugLogger from './components/BugLogger.vue';

const userStore = useUserStore();
const isSocketConnected = ref(false);

const router = useRouter();

const listStore = useListStore()
userStore.loadUser();
const isDev = ref(import.meta.env.MODE === 'development');

const user  = computed(() => userStore.getUser)

onBeforeMount(async () => {
  
  if (!user.value) {
    console.log('PUSHING TO LOGIN');
    router.push('/login');
  }
})

watchEffect(async() => {
 
  if (user.value) {
    setUpSockets();
    try {
      
      await listStore.loadLists()
    } catch (error) {
      showErrorMsg(error);
    }
  }
})

onMounted(async () => {
  console.debug('import.mete.env', import.meta.env);
  document.title = import.meta.env.VITE_APP_TITLE;
  
;
  
  // טוען נתונים ומגדיר sockets
 
})

function toggleSocket(val) {
let timeOutIdx = null;
  isSocketConnected.value = val;
  if (val) {
    console.log('Tab is in focus, reconnecting socket');
    socketService.setup()
    clearInterval(timeOutIdx);
  } else {
      socketService.off()
  }
}


let timeOutIdx = null;
const SOCKET_TIMEOUT = 7 * 60 * 1000;
// SOCKET: manage socket connections
function setUpSockets() {

  toggleSocket(true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      timeOutIdx = setTimeout(() => {
        toggleSocket(false);
      }, SOCKET_TIMEOUT);
    } else {
      clearTimeout(timeOutIdx);
      if (!isSocketConnected.value) {
        toggleSocket(true);

      }
    }
  });
}






</script>

<style scoped>

.main-app {
  height: 100dvh;
  
}

</style>
