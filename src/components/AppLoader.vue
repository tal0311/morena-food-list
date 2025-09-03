<template>
  <Teleport to="body">
    <Transition name="loader-fade">
      <div v-if="isVisible" class="app-loader-overlay">
        <div class="app-loader-content">
          <div class="spinner"></div>
          <p v-if="message" class="loader-message">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { eventBus } from '@/services/event-bus.service'

const isVisible = ref(false)
const message = ref('')

const showLoader = (msg = '') => {
  isVisible.value = true
  message.value = msg
}

const hideLoader = () => {
  isVisible.value = false
  message.value = ''
}

onMounted(() => {
  eventBus.on('showAppLoader', showLoader)
  eventBus.on('hideAppLoader', hideLoader)
})

onUnmounted(() => {
  eventBus.off('showAppLoader', showLoader)
  eventBus.off('hideAppLoader', hideLoader)
})
</script>

<style scoped>
.app-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: grid;
  place-items: center;
  z-index: 10000;
}

.app-loader-content {
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--bClr3);
  border-top: 4px solid var(--bClr5);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loader-message {
  margin: 0;
  color: var(--bClr4);
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transition animations */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>