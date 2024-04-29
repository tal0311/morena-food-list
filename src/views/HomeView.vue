<template>
  <section class="home-view">
    <header >
      <h1>Morena's list</h1>
      <p>{{ getIcon }}</p>
    </header>

    <section class="welcome-section grid">
     
        <TheWelcome  @toggleTour="toggleTour"/>
      
        <footer id="language-modal">
        <div v-if="isLangModalOpen" class="lang-modal grid">
          <button @click="setLang('en')">English</button>
          <button @click="setLang('es')">Español</button>
          <button @click="setLang('he')">עברית</button>
        </div>
        <button @click="toggleLangMOdal" class="icon" v-html="$svg('translate')"></button>
      </footer>
    </section>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import TheWelcome from '@/components/TheWelcome.vue'
import { useListStore } from '@/stores/list-store'
import {useRoute} from 'vue-router'
import {useAppStore} from '@/stores/app-store'
import {useTour} from '@/composables/useTour'

const isLangModalOpen = ref(false)

function toggleLangMOdal() {
  isLangModalOpen.value = !isLangModalOpen.value
}

const listStore = useListStore()
function setLang(lang) {
  toggleLangMOdal()
  listStore.setLang(lang)
}

const getIcon = computed(() => {
  const icons = ["✅", "🥬", "🥦", "🥒", "🥑", "🫒", "🍅", "🍄", "🍑", "🍌", "🍇", "☕", "🥛", "🥩", "🧀", "🥚", "🥝", "🍉", "🍎", "🥭", "🍍", "🍌", "🍋", "🍊", "🍒", "🍓", "🫐", "🫑", "🌽", "🍆", "🫒", "🍅"];
  return icons[Math.floor(Math.random() * icons.length)];
})

const appStore = useAppStore()
function toggleTour(){
 appStore.toggleTourState()
}
 
const isTourActive = computed(() => appStore.getIsTourActive)
const route = useRoute()
watchEffect(() => {
  if(isTourActive.value){
    useTour(route.name)
    console.log('tour is active');

  }
})


</script>

<style scoped>

header {
 position: fixed;
  top: 1rem;
  width: 100%;
  text-align: center;
  left: 0;
  font-size: 2.8rem;
}

h1,p{
  margin: 0;

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
  top: -170%;
}

.lang-modal button {

  font-size: 1.2rem;
  background-color: white;
  border: 1px solid black;
  cursor: pointer;
}
</style>