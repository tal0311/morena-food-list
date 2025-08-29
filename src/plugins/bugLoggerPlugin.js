import BugLogger from '@/components/BugLogger.vue';

export default {
  install(app) {
    // Register the BugLogger component globally
    app.component('BugLogger', BugLogger);
  }
};
