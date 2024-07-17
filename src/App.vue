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
// TODO : make labels hurd coded in user


import { ref, onBeforeMount } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';

const listStore = useListStore();

const userStore = useUserStore();
onBeforeMount(async () => {
  console.log('App is mounted');

  await userStore.loadUser();
 await listStore.loadLists()
  
})
</script>




<style scoped>
.main-app {
  height: 100dvh;

}
</style>
