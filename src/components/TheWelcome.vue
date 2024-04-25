
<template>
 <section>
  <h1>welcome to the home page</h1>

  <div class="action-container">
    <button @click="onTakeTour">What to do?</button>
    <button to="/register">
      <RouterLink to="/list">I'm At home here</RouterLink>
    </button>
  </div>
 </section>
</template>

  <script setup>
  
  import { useRouter } from 'vue-router'
  const router = useRouter()

  const onTakeTour = () => {
    router.push('/list?tour=true')
  }
  </script>

  <style scoped></style>