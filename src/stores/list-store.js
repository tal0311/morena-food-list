import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service";
// import { listService } from "@/services/list.service.local.js";
import { listService } from "@/services/list.service.js";
import { utilService } from "@/services/util.service";
import {
  showUserMsg,
  showErrorMsg,
  showSuccessMsg,
} from "@/services/event-bus.service";
import { useUserStore } from "@/stores/user-store";


export const useListStore = defineStore("list", () => {
  const userStore = useUserStore();

  const lists = ref(null);
  const currList = ref(null);
  const listByLabels = ref(null);

  const getCurrList = computed(() => currList.value);

  const getListForSummary = computed(() => Object.values(listByLabels.value)
    .flatMap(item => item)
    .filter(item => currList.value.items.includes(item._id)));

  const getItemList = computed(() => {
    return listByLabels.value;
  });

  const userLists = computed(() => {
    return lists?.value;
  });

  async function loadItems(labels = true) {
    try {
      const items = await itemService.query({ labels });
      // BUG: only this is to set the user in its store after it has labels or the list in indx view will not render the labels, need to find a better way, maybe to load the user in the app store
      // use socket from BE later to load the user with labels
      listByLabels.value = items
      userStore.loadUser();
      checkDefaultSelectedItems(items);

    } catch (error) {
      console.debug("Failed to load list", error);
      // useAppStore().logError(error, false);
      // TODO: show error message 
      // showErrorMsg("Failed to load list, please try again later");
    }
  }

  // if the admin has selected items to be selected by default in db, this function will select them
  function checkDefaultSelectedItems(listByLabels) {
     for (const key in listByLabels) {
      const itemsToSelect = listByLabels[key].filter(item => item.isSelected);
      if (itemsToSelect.length) {
        itemsToSelect.forEach(item => {
          addItemToCurrList(item._id);
        })
      }
    }
  }

  async function updateLabel(label) {
    // debugger
    await itemService.updateLabel(label);


    showSuccessMsg('labelUpdated');
  }

  function toggleSelect({ labelName, itemId }) {

    listByLabels.value[labelName].map(item => {
      if (item._id === itemId) {
        item.isSelected = !item.isSelected;
      }
      return item;
    })

    addItemToCurrList(itemId);

  }

  function addItemToCurrList(itemId) {
    if (!currList.value) currList.value = listService.getEmptyList();

    if (currList.value.items.includes(itemId)) {
      currList.value.items = currList.value.items.filter((id) => id !== itemId);
    } else {
      currList.value.items.push(itemId);
    }
  }


  async function clearItems() {
    // debugger
    currList.value.items = []
    await loadItems();

  }

  function setCurrList(list, isShared = false) {
    currList.value = list;
    const listItems = currList.value.items

    for (const key in listByLabels.value) {
      listByLabels.value[key].map(item => {
        if (listItems.includes(item._id)) {
          item.isSelected = true;
          if (isShared) {
            item.isShared = isShared;

          }
        }
        return item;
      });
    }

  }

  async function loadLists(filterBy = {}) {
    try {

      lists.value = await listService.query(filterBy);

    } catch (error) {
      showErrorMsg("Failed to load lists, please try again later");

    }

  }

  function createShearedList(ids) {

    const list = listService.getEmptyList("Shared List");
    list.items = ids.split(",").map((id) => id.trim());

    list._id = utilService.makeId()

    setCurrList(list, true);
    utilService.saveToStorage("shared-list", currList.value);
    return currList.value;

  }

  function loadSharedList() {
    try {
      const list = utilService.loadFromStorage("shared-list");

      setCurrList(list, true);
      return list;
    } catch (error) {
      showErrorMsg("Failed to load sheared list, create a new one");
    }
  }

  return {
    loadSharedList,
    loadItems,
    createShearedList,
    getItemList,
    toggleSelect,
    // getSelectedItems,
    // getLabels,
    updateLabel,
    // setItemsFromShearedList,
    clearItems,
    loadLists,
    userLists,
    setCurrList,
    getCurrList,
    getListForSummary
  };
});
