import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { errorService } from "@/services/error.service";

// TODO : convert error handling to plugin
export const useAppStore = defineStore("app", () => {

  const errorLogs = ref([]);

  errorService.setup()
  

  function logError(err, isShowError = true) {
    if (isShowError) {
      showErrorMsg("Opps, it's not you, it's us. We are working on fixing it");
    }
    errorLogs.value.push(err);
  }

  function reportError() {
    reportService.sendEmail(errorLogs.value);
  }

  return {
   
    logError,
    reportError,
   
  }
})


