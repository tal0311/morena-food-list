import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";
import { listService } from "@/services/list.service.js";
import {
  showUserMsg,
  showErrorMsg,
  showSuccessMsg,
} from "@/services/event-bus.service";
import { useAppStore } from "@/stores/app-store";
import { useUserStore } from "@/stores/user-store";
import { userService } from "@/services/user.service";


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
    console.log('listByLabels', listByLabels.value);
    return listByLabels.value;
  });

  const userLists = computed(() => {

    return lists?.value;
  });

  watchEffect(() => {
    if(currList.value) console.log('currList', currList.value.items);
  });


  async function loadItems() {
    try {
      listByLabels.value = await itemService.query({ labels: true });

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


    showSuccessMsg("Label updated successfully");
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

  function setCurrList(list) {
    currList.value = list;
    const listItems= currList.value.items

    for (const key in listByLabels.value) {
      listByLabels.value[key].map(item => {
        if (listItems.includes(item._id)) {
          item.isSelected = true;
        }
        return item;
      });
    }
   
  }

  async function loadLists() {
    try {

      lists.value = await listService.query();
      console.log('loadLists', lists.value);
    } catch (error) {
      showErrorMsg("Failed to load lists, please try again later");

    }

  }

  return {
    loadItems,
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
