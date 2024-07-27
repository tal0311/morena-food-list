
import { getCurrentInstance } from 'vue';

export function useGlobals() {
  const { appContext } = getCurrentInstance();
  const { $trans, $svg } = appContext.config.globalProperties;

  return {
    $trans,
    $svg
  };
}
