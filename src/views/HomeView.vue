<template>
  <main class="">
    <TheWelcome />
  </main>

  <footer>
    <div v-if="isLangModalOpen" class="lang-modal grid">
      <button @click="setLang('en')">English</button>
      <button @click="setLang('es')">Español</button>
      <button @click="setLang('he')">עברית</button>
    </div>
    <button @click="toggleLangMOdal" class="icon" v-html="$svg('translate')"></button>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import TheWelcome from '@/components/TheWelcome.vue'
import { useListStore } from '@/stores/list-store'

const isLangModalOpen = ref(false)

function toggleLangMOdal() {
  isLangModalOpen.value = !isLangModalOpen.value
}

const listStore = useListStore()
function setLang(lang) {
  toggleLangMOdal()
  listStore.setLang(lang)

}
</script>

<style scoped>
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
  top: -170%;
}

.lang-modal button {

  font-size: 1.2rem;
  background-color: white;
  border: 1px solid black;
  cursor: pointer;
}
</style>