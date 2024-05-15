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
import { useListStore } from '@/stores/list-store';
import { useRecipeStore } from '@/stores/recipe-store';


// const listStore = useListStore()
// const recipeStore = useRecipeStore()



const userStore = useUserStore()
onBeforeMount(() => {
loadUser()


   
  
})

 function loadUser() {
  try {
    
    userStore.loadUser()
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
