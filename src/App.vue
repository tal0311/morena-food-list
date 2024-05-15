<template>
  <section class="main-app main-layout" >
    <RouterView />
    <UserMsg />
  </section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from '@/stores/user-store';


const userStore = useUserStore()
onBeforeMount(() => {
loadUser()
  
})

async function loadUser() {
  try {
    
    await userStore.loadUser()
  } catch (error) {
    console.log('no logged user/ route use user page ', error);
  }
}


</script>


<style scoped>
.main-app {
  height: 100dvh;

}
</style>
