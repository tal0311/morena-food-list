import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStore = defineStore("app", () => {
  const isTourActive = ref(false);
  //   TODO : move language to app store

  const getIsTourActive = computed(() => isTourActive.value);

  function toggleTourState() {
    isTourActive.value = !isTourActive.value;
  }
  return {
    getIsTourActive,
    toggleTourState,
  };
});
