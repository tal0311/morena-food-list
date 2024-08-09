<template>
  <section class="main-app main-layout">
    <RouterView />
    <UserMsg />
    <AppModal />
  </section>
</template>

<script setup>
//TODO: canva info ang img
// TODO: in supermarket screen, shoed list of items not selected and able to select then like in summary screen
// TODO: in summary screen, show the items that by group order
// TODO: lock screen in super mode to prevent touching the screen,
// TODO: moran filter unwanted items

import { computed, watchEffect, onMounted, ref, onBeforeMount } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';
import { userService } from './services/user.service';
import AppModal from '@/components/AppModal.vue';
import { useRouter } from 'vue-router';


import { socketService, SOCKET_EVENT_UPDATE_USER } from './services/socket.service';

const userStore = useUserStore();
const isSocketConnected = ref(false);
onBeforeMount(() => {

  socketService.on(SOCKET_EVENT_UPDATE_USER, (user) => {
    console.log('User updated', user);
    
  
  })
})

onMounted(() => {
  console.debug('import.mete.env', import.meta.env);
  document.title = import.meta.env.VITE_APP_TITLE;

  console.log(import.meta.env.VITE_APP_TITLE);


})

function toggleSocket(val) {

  isSocketConnected.value = val;
  if (val) {
    console.log('Tab is in focus, reconnecting socket');
    socketService.setup()
  } else {
    console.log('Tab is hidden, disconnecting socket');
    socketService.off()
  }


}

const listStore = useListStore();

const user = computed(() => userStore.getUser);
const router = useRouter();

watchEffect(() => {
  if (user.value) {
    setUpSockets()
    loadData()
  } else {
    router.push('/login')
  }
})



let timeOutIdx = null;
const SOCKET_TIMEOUT = 5000;
// SOCKET: manage socket connections
function setUpSockets() {
  console.log('App is mounted');
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
  await userStore.loadUser();
  await listStore.loadLists()
}
</script>

<style scoped>
.main-app {
  height: 100dvh;

}
</style>
