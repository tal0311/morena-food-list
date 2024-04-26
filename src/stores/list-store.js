import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";

export const useListStore = defineStore("list", () => {
  const list = ref(null);
  const selectedItems = ref([]);

  const getList = computed(() => list?.value);
  const getSelectedItems = computed(() => selectedItems?.value);

  async function loadList() {
    list.value = await itemService.query();
  }

  function toggleSelect(itemId) {
    console.log("itemId", itemId);
    console.log("ok", list.value);
    const itemIdx = list.value.findIndex((item) => item._id === itemId);
    const item = list.value[itemIdx];
    item.isSelected = !item.isSelected;
    list.value.splice(itemIdx, 1, item);
    selectedItems.value.push(item);
  }
  return { loadList, getList, toggleSelect, getSelectedItems };
});
