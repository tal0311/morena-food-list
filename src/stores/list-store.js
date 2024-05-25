import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";
import { showUserMsg, showErrorMsg, showSuccessMsg } from "@/services/event-bus.service";
import { useAppStore } from "@/stores/app-store";
import { useUserStore } from "@/stores/user-store";

export const useListStore = defineStore("list", () => {
  const userStore = useUserStore();


  const list = ref(null);
  const selectedItems = ref([]);
  // const currLang = ref("en");
  const labels = ref(null)

  const getList = computed(() => {
    if (list.value) {
    
      return itemService.getGroupsByLabels(list.value);
    }

  });
  const getSelectedItems = computed(() => selectedItems?.value);

  const getLabels = computed(() => labels.value)

  // this is to wait for the list to be loaded before setting the labels from local storage or from list
  // labels in local storage will contain all the user input for labels
  watchEffect(() => {
    if (list.value) {
      setLabels()
    }
  });



  function setLabels() {
    labels.value = itemService.getLabels(getList.value)
  }


  async function loadList() {
    try {
      const items = await itemService.query();
      list.value = items;

    } catch (error) {
      console.debug("Failed to load list", error);
      // useAppStore().logError(error, false);
      showErrorMsg("Failed to load list, please try again later");

    }

  }


  function setItemsFromShearedList(itemsIds) {
    // console.log('setItemsFromShearedList', itemsIds);
    const userItems = userStore.getUser.selectedItems;

    list.value.map((item) => {
      if (itemsIds.includes(item._id)) {
        // console.debug('item', item);

        item.isSelected = true;
        selectedItems.value.push(item);
      }
      return item;

    })
    userStore.updateUser("selectedItems", userItems);
  }

  function updateLabel(label) {

    labels.value = itemService.updateLabel(label);
    showSuccessMsg("Label updated successfully");
  }

  function toggleSelect(itemId) {
    console.log('toggle select', itemId);
    const itemIdx = list?.value.findIndex((item) => item._id === itemId);
    const item = list.value[itemIdx];
    item.isSelected = !item.isSelected;
    list.value.splice(itemIdx, 1, item);
    if (item.isSelected) {
      selectedItems.value.push(item);
    } else {
      selectedItems.value = selectedItems.value.filter((i) => i._id !== itemId);
    }
    userStore.updateUser('selectedItems', JSON.parse(JSON.stringify(selectedItems.value)))
  }


  return {
    loadList,
    getList,
    toggleSelect,
    getSelectedItems,
    getLabels,
    updateLabel,
    setItemsFromShearedList
  };
});
