<template>
  <section class="main-app main-layout" >
    <RouterView />
    <UserMsg />
  </section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import UserMsg from '@/components/UserMsg.vue'



</script>


<style scoped>
.main-app {
  height: 100dvh;

}
</style>
