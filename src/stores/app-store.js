import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";

// TODO : convert error handling to plugin
export const useAppStore = defineStore("app", () => {
  const isTourActive = ref(false);
  const errorLogs = ref([]);
  //   TODO : move language to app store

  const getIsTourActive = computed(() => isTourActive.value);

  function toggleTourState() {
    isTourActive.value = !isTourActive.value;
  }

  function logError(err, isShowError = true) {
    if (isShowError){
      showErrorMsg("Opps, it's not you, it's us. We are working on fixing it");
    }
    errorLogs.value.push(err);
    console.log(errorLogs.value);
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
