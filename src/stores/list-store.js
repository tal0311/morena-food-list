import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service";
import { listService } from "@/services/list.service.local.js";
import { utilService } from "@/services/util.service";
import {
  showUserMsg,
  showErrorMsg,
  showSuccessMsg,
} from "@/services/event-bus.service";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "vue-router";




export const useListStore = defineStore("list", () => {
  const router = useRouter();

  const userStore = useUserStore();

  const lists = ref(null);
  const currList = ref(null);
  const listByLabels = ref(null);

  const getCurrList = computed(() => currList.value);

  const getListForSummary = computed(() => Object.values(listByLabels.value)
    .flatMap(item => item)
    .filter(item => currList.value.items.includes(item._id)));

  const getItemList = computed(() => {
    // console.log('listByLabels', listByLabels.value);
    return listByLabels.value;
  });

  const userLists = computed(() => {

    return lists?.value;
  });

  


  async function loadItems() {
    try {
      listByLabels.value = await itemService.query({ labels: true });
      // BUG: only this is to set the user in its store after it has labels or the list in indx view will not render the labels, need to find a better way, maybe to load the user in the app store
      // use socket from BE later to load the user with labels
      userStore.loadUser();

    } catch (error) {
      console.debug("Failed to load list", error);
      // useAppStore().logError(error, false);
      showErrorMsg("Failed to load list, please try again later");
    }
  }

  // function setItemsFromShearedList(itemsIds) {
  //   const user = userStore.loggedUser;
  //   const userItems = user.selectedItems;

  //   listByLabels.value = listByLabels.value.map((item) => {
  //     if (itemsIds.includes(item._id)) {
  //       item.isSelected = true;
  //       if (userItems.find((i) => i._id === item._id)) {
  //         return item;
  //       }
  //       userItems.push(item);
  //     }
  //     return item;
  //   });

  //   userStore.updateUserItems(userItems);
  // }

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

    // console.log(currList.value);
    // debugger
    if (!currList.value) currList.value = listService.getEmptyList();

    if (currList.value.items.includes(itemId)) {
      currList.value.items = currList.value.items.filter((id) => id !== itemId);
      // console.log('currList inclouds', currList.value);

    } else {
      currList.value.items.push(itemId);
    }



    // console.log('currList', currList.value);

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

  async function loadLists() {
    try {

      lists.value = await listService.query();
      // console.log('loadLists', lists.value);
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
      // console.log('list from storage', list);
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
