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

  const getItemList = computed(() => {
    console.log('listByLabels', listByLabels.value);
    return listByLabels.value;
  });

  const userLists = computed(() => {

    return lists?.value;
  });


  // const selectedItems = ref([]);
  // const currLang = ref("en");


  // const getList = computed(() => {
  //   if (list.value) {
  //     return itemService.getGroupsByLabels(list.value);
  //   }
  // });
  // const getSelectedItems = computed(() => selectedItems?.value);



  // async function setLabels() {
  //   labels.value = await itemService.getLabels(
  //     getList.value,
  //     userStore.getUser
  //   );
  // }

  async function loadItems() {
    try {
      listByLabels.value = await itemService.query();

    } catch (error) {
      console.debug("Failed to load list", error);
      // useAppStore().logError(error, false);
      showErrorMsg("Failed to load list, please try again later");
    }
  }

  function setItemsFromShearedList(itemsIds) {
    const user = userStore.loggedUser;
    const userItems = user.selectedItems;

    listByLabels.value = listByLabels.value.map((item) => {
      if (itemsIds.includes(item._id)) {
        item.isSelected = true;
        if (userItems.find((i) => i._id === item._id)) {
          return item;
        }
        userItems.push(item);
      }
      return item;
    });

    userStore.updateUserItems(userItems);
  }

  async function updateLabel(label) {
    // debugger
    labels.value = await itemService.updateLabel(label);
    console.log("labels", labels.value);

    showSuccessMsg("Label updated successfully");
  }

  function toggleSelect({labelName, itemId}) {
    console.log('toggleSelect', labelName, itemId);
    listByLabels.value[labelName].map(item => {
      if (item._id === itemId) {
        item.isSelected = !item.isSelected;
      }
      return item;
    })

    console.log('listByLabels', listByLabels.value[labelName]);
   
    // const item = list.find((i) => i._id === itemId);

    // item.isSelected = !item.isSelected;

    // debugger
    // const idx = currList.value.items.findIndex((i) => i._id === itemId)

    // if (idx === -1) {
    //   currList.value.items.push(item)
    // } else {
    //   currList.value.items.splice(idx, 1)
    // }

    // console.log('currList', currList.value);

  }
  // function toggleSelect(itemId) {
  //   // debugger;
  //   console.trace();
  //   const itemIdx = listByLabels?.value.findIndex((item) => item._id === itemId);
  //   const item = listByLabels.value[itemIdx];
  //   item.isSelected = !item.isSelected;

  //   listByLabels.value.splice(itemIdx, 1, item);

  //   let { selectedItems } = userStore.loggedUser;

  //   if (item.isSelected) {
  //     selectedItems.push(item);
  //   } else {
  //     selectedItems = selectedItems.filter((i) => i._id !== itemId);
  //   }

  //   // console.log('after selected', selectedItems);
  //   userStore.updateUser('selectedItems', JSON.parse(JSON.stringify(selectedItems)))
  // }

  async function clearItems() {
    // debugger
    listByLabels.value = listByLabels.value.map((item) => {
      item.isSelected = false;
      return item;
    });

    userStore.updateUser("selectedItems", []);
    //  const user= userService.getLoggedInUser();
    //   user.selectedItems = [];
    //  await userService.save(user);
  }

  function setCurrList(listId) {
    currList.value = lists.value.find((list) => list._id === listId);
  }

  async function loadLists() {

    lists.value = await listService.query();
    console.log('loadLists', lists.value);
    // try {
    //   // debugger
    //   const lists = await itemService.query();
    //   console.log('lists', lists);
    //   listByLabels.value = lists;
    // } catch (error) {
    //   console.debug("Failed to load lists", error);
    //   showErrorMsg("Failed to load lists, please try again later");
    // }
  }

  return {
    loadItems,
    getItemList,
    toggleSelect,
    // getSelectedItems,
    // getLabels,
    updateLabel,
    setItemsFromShearedList,
    clearItems,
    loadLists,
    userLists,
    setCurrList,
    getCurrList
  };
});
