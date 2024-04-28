<template>
  <section  id="welcome-view" class="welcome-view grid">
    <h1>{{ $trans('home-page') }}</h1>

    <div class="action-container grid">
      <button class="tour-btn" @click="$emit('toggleTour')">{{ $trans('home-action-1') }}</button>
      <button class="link-btn">
      {{ $trans('home-action-2') }}
      </button>
    </div>
  </section>
</template>

<script setup>




</script>

<style scoped>
h1 {
  margin: 0;

}

button {
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