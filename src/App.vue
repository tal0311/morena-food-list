<template>
  <section class="main-app main-layout">
    <RouterView />
  </section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';

onBeforeMount(() => {
  setTiTle()
})

function setTiTle() {
  document.title = `Morena ${getIcon()} grocery list`

}

function getIcon() {
  const icons = ["✅", "🥬", "🥦", "🥒", "🥑", "🫒", "🍅", "🍄", "🍑", "🍌", "🍇", "☕", "🥛", "🥩", "🧀", "🥚", "🥝", "🍉", "🍎", "🥭", "🍍", "🍌", "🍋", "🍊", "🍒", "🍓", "🫐", "🫑", "🌽", "🍆", "🫒", "🍅"];
  return icons[Math.floor(Math.random() * icons.length)];
}


</script>

<style scoped>
.main-app {
  height: 100dvh;

}
</style>
