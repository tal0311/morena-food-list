<template>
  <section class="main-app main-layout">
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


import { computed, onMounted, ref, onBeforeMount } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';
import AppModal from '@/components/AppModal.vue';
import { useRouter } from 'vue-router';
import { i18Service } from "./services/i18n.service";


import { socketService } from './services/socket.service';
import BugLogger from './components/BugLogger.vue';

const userStore = useUserStore();
const isSocketConnected = ref(false);

const router = useRouter();
const listStore = useListStore()


onBeforeMount(async() => {
  console.log('App is about to mount');
  userStore.loadUser();
  const user = computed(() => userStore.getUser).value

  if (user?.email && user?.username) {
    setUpSockets()
    loadData()
  } else {
    router.push('/login')
  }
})


onMounted(() => {
  console.debug('import.mete.env', import.meta.env);
  document.title = import.meta.env.VITE_APP_TITLE;
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
