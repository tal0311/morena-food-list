<template>
  <section class="main-app main-layout">
    <RouterView />
    <UserMsg />

  </section>
</template>

<script setup>
//TODO: canva info ang img

import { computed, watchEffect, onMounted, ref } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';
import { useRouter } from 'vue-router';
import config from '@/config';

// import { socketService } from './services/socket.service';

const isSocketConnected = ref(false);
let timeOutIdx = null;

onMounted(() => {
  console.debug('import.mete.env', import.meta.env);
  setStage()

})

function setStage() {


}


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
