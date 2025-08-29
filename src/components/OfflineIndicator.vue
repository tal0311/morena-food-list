<template>
  <div v-if="!isOnline" class="offline-indicator">
    <span>🔴 אין חיבור לאינטרנט</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);

const handleOnline = () => {
  isOnline.value = true;
  console.log('🌐 חזרתי לאינטרנט');
};

const handleOffline = () => {
  isOnline.value = false;
  console.log('📴 איבדתי חיבור לאינטרנט');
};

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});
</script>

<style scoped>
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ff4444;
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
  z-index: 10000;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
