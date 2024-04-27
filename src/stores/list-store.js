import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";

export const useListStore = defineStore("list", () => {
  const list = ref(null);
  const selectedItems = ref([]);
  const currLang = ref("he");

  const getList = computed(() => list?.value);
  const getSelectedItems = computed(() => selectedItems?.value);
  const getCurrLang = computed(() => currLang?.value);

  async function loadList() {
    list.value = await itemService.query();
  }

  function toggleSelect(itemId) {
    const itemIdx = list.value.findIndex((item) => item._id === itemId);
    const item = list.value[itemIdx];
    item.isSelected = !item.isSelected;
    list.value.splice(itemIdx, 1, item);
    selectedItems.value.push(item);
  }

  function setLang(lang) {
    langOptions = ["en", "he", "es"];
    currLang.value = langOptions.includes(lang) ? lang : "en";
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
