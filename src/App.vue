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

import { computed, watchEffect, onMounted, ref } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';
import AppModal from '@/components/AppModal.vue';
import { useRouter } from 'vue-router';


// import { socketService } from './services/socket.service';

const isSocketConnected = ref(false);
let timeOutIdx = null;

onMounted(() => {
  console.debug('import.mete.env', import.meta.env);
  document.title = import.meta.env.VITE_APP_TITLE;

  console.log(import.meta.env.VITE_APP_TITLE);
  

})




// SOCKET: manage socket connections
// onMounted(() => {
//   console.log('App is mounted');
//   toggleSocket(true);
//   document.addEventListener('visibilitychange', () => {
//     if (document.hidden) {
//       timeOutIdx = setTimeout(() => {
//         toggleSocket(false);
//       }, 5000);
//     } else {
//       clearTimeout(timeOutIdx);
//       toggleSocket(true);
//     }
//   });
// });

function toggleSocket(val) {
  isSocketConnected.value = val;
  if (val) {
    console.log('Tab is in focus, reconnecting socket');
    // socketService.setup()
  } else {
    console.log('Tab is hidden, disconnecting socket');
    // socketService.terminate()
  }


}

const listStore = useListStore();
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const router = useRouter();

watchEffect(() => {
  if (user.value) {
    loadData()
    // socketService.setup()
  } else {
    router.push('/login')
  }
})





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
