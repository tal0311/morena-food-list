<template>
  <section class="welcome-view grid">
    <h1>{{ $trans('home-page') }}</h1>

    <div class="action-container grid">
      <button @click="onTakeTour">{{ $trans('home-action-1') }}</button>
      <button class="link-btn">
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
h1 {
  margin: 0;

}

button:not(.link-btn) {
  padding: 0.8rem;
}
.link-btn{
  padding: 0;
}

a {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  padding: 0.8rem;
}

.welcome-view {
  display: grid;
  text-align: center;
  font-size: 1.5rem;
  height: 40vh;
  width: 50vw;
  place-content: space-evenly;

}

.action-container {
  gap: 1rem;
}
</style>