<template>
  <section class="home-view">
    <header>
      <h1>Mrena's Food List</h1>
      <p>{{ getIcon }}</p>
    </header>

    <section class="welcome-section grid">

      <TheWelcome />

      <footer id="language-modal" @contextmenu="resetStorage">
        <RouterLink to="/user" class="icon" v-html="$svg('account')"></RouterLink>
      </footer>
     <section >
      <!-- <GoogleLogin :callback="callback" prompt auto-login/> -->
     </section>
    </section>

  </section>
</template>

<script setup>

// TODO: 'add last login date to user and refresh the local storage btn'
import { ref, computed, onMounted, watchEffect } from 'vue'
// import vue3GoogleLogin from 'vue3-google-login'
import TheWelcome from '@/components/TheWelcome.vue'
import { useListStore } from '@/stores/list-store'
import { useAppStore } from '@/stores/app-store'
// import { useRoute } from 'vue-router'
// import { useTour } from '@/composables/useTour'

const getIcon = computed(() => {
  const icons = ["✅", "🥬", "🥦", "🥒", "🥑", "🫒", "🍅", "🍄", "🍑", "🍌", "🍇", "☕", "🥛", "🥩", "🧀", "🥚", "🥝", "🍉", "🍎", "🥭", "🍍", "🍌", "🍋", "🍊", "🍒", "🍓", "🫐", "🫑", "🌽", "🍆", "🫒", "🍅"];
  return icons[Math.floor(Math.random() * icons.length)];
})

function resetStorage() {
  localStorage.clear()
  location.reload()
}



</script>

<style scoped>
header {
  position: fixed;
  top: 1rem;
  width: 100%;
  text-align: center;
  left: 0;
  font-size: 2.5rem;
}

h1,
p {
  margin: 0;

}
h1{
  font-size: 2.5rem;

}

section {
  display: grid;
  place-content: center;

}

.icon {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-content: center;
}

.icon svg {
  width: 100%;
  height: 100%;
}

footer {
  position: fixed;
  bottom: 3rem;
  left: 3rem;
}

.lang-modal {
  position: absolute;
  top: -250%;
  border: none;
  background: var(--bClr1);
  box-shadow: 0 0 1px 0 var(--clr7);
  border-radius: 0.5rem;
  gap: 1rem;
  padding-block: 0.5rem;
}

.lang-modal button {
  all: unset;
  padding-inline: 0.5rem;


}
</style>