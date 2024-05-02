import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";

export const useAppStore = defineStore("app", () => {
  const isTourActive = ref(false);
  const errorLogs = ref([]);
  //   TODO : move language to app store

  const getIsTourActive = computed(() => isTourActive.value);

  function toggleTourState() {
    isTourActive.value = !isTourActive.value;
  }

  function logError(err) {
    showErrorMsg("Opps, it's not you, it's us. We are working on fixing it");
    errorLogs.value.push(err);
  }

function reportError(){
  reportService.sendEmail(errorLogs.value);
}

  return {
    getIsTourActive,
    toggleTourState,
    logError,
    reportError
  }
})
