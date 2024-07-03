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

</script>


<style scoped>
.main-app {
  height: 100dvh;

}
</style>
