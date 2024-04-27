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
footer {
  position: fixed;
  bottom: 3rem;
  left: 3rem;
}

.lang-modal {
  position: absolute;
  top: -250%;
}
</style>