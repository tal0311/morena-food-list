<template>
  <section class="main-app main-layout">
    <RouterView />
    <UserMsg />
  </section>
</template>

<script setup>
//TODO: canva info ang img
//TODO: more recipe
// TODO: add more examples for food types


import { ref, onBeforeMount } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';

const userStore = useUserStore();
onBeforeMount(() => {
  console.log('App is mounted');

  userStore.loadUser();
  
})
</script>




<style scoped>
.main-app {
  height: 100dvh;

}
</style>
