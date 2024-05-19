<template>
  <section  id="welcome-view" class="the-welcome grid">
    <h1>{{ $trans('home-page') }}</h1>

    <div class="action-container grid">
      <button class="tour-btn primary-btn" @click="navigateTo">{{ $trans('home-action-1') }}</button>
      <button class="link-btn primary-btn">
        <RouterLink to="/list">{{ $trans('home-action-2') }}</RouterLink>
      </button>
    </div>
  </section>
</template>

<script setup>
// import router from '@/router';
import { useRouter } from 'vue-router';

const router = useRouter();
function navigateTo() {
  console.log('navigateTo');
router.push({ name: 'recipe' , query:{inspiration: true}})
}


</script>

<style scoped>
h1 {
  margin: 0;

}

button{
  line-height: 1.5rem;
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
.the-welcome {
  /* display: grid; */
  text-align: center;
  font-size: 1.5rem;
  height: 40vh;
  width: 50vw;
  place-content: space-evenly;

}

.action-container {
  gap: 1.2rem;
  grid-template-rows: 50% 50%;
}


</style>