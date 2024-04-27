<template>
  <section class="welcome-view grid"> 
    <h1>{{ $trans('home-page') }}</h1>

    <div class="action-container grid">
      <button @click="onTakeTour">{{ $trans('home-action-1') }}</button>
      <button to="/register">
        <RouterLink to="/list">{{ $trans('home-action-2') }}</RouterLink>
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

<style scoped>
button{
  padding: 0;
}

a{
  width: 100%;
    height: 100%;
    display: grid;
    place-content: center;
}

.welcome-view{
  text-align: center;
  font-size: 1.5rem;
  height: 40vh;
  width: 50vw;
}
.action-container {
  gap: 1rem;
}
</style>