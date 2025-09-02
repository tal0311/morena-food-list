<template>
  <section class="main-app main-layout">
    <OfflineIndicator />
    <RouterView />
    <UserMsg />
    <AppModal />
    <BugLogger/>
  </section>
</template>

<script setup>
//TODO: canva info ang img
// TODO: in summary screen, show the items that by group order
// TODO: lock screen in super mode to prevent touching the screen,
// TODO: moran filter unwanted items


import { computed, onBeforeMount, onMounted, ref } from 'vue';
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
const route = useRoute();
const listStore = useListStore()

onBeforeMount(async () => {
  
  // await userStore.loadUser();
  // if (!userStore.getUser) {
  //   router.push('/login');
  // }else{
    setUpSockets();
    await loadData();
  // }
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





async function loadData() {
  await listStore.loadLists()
}
</script>

<style scoped>

.main-app {
  height: 100dvh;
  
}

</style>
