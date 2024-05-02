import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";
import { showUserMsg, showErrorMsg } from "@/services/event-bus.service";
import { useAppStore } from "@/stores/app-store";

export const useListStore = defineStore("list", () => {
  const list = ref(null);
  const selectedItems = ref([]);
  const currLang = ref("en");

  const getList = computed(() => list?.value);
  const getSelectedItems = computed(() => selectedItems?.value);
  const getCurrLang = computed(() => currLang.value);

  async function loadList() {
    try {
      list.value = await itemService.query();
    } catch (error) {
      console.debug("Failed to load list", error);
      useAppStore().logError(error, false);
      showErrorMsg("Failed to load list, please try again later");

    }
    // list.value = null
  }

  function toggleSelect(itemId) {
    const itemIdx = list.value.findIndex((item) => item._id === itemId);
    const item = list.value[itemIdx];
    item.isSelected = !item.isSelected;
    list.value.splice(itemIdx, 1, item);
    if (item.isSelected) {
      selectedItems.value.push(item);
    } else {
      selectedItems.value = selectedItems.value.filter((i) => i._id !== itemId);
    }
  }

  function setLang(lang) {
    const langOptions = ["en", "he", "es"];
    currLang.value = langOptions.includes(lang) ? lang : "en";
    document.body.setAttribute("dir", currLang.value === "he" ? "rtl" : "ltr");
  }

  return {
    loadList,
    getList,
    toggleSelect,
    getSelectedItems,
    getCurrLang,
    setLang,
  };
});
