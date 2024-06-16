import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";
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

  const list = ref(null);
  // const selectedItems = ref([]);
  // const currLang = ref("en");
  const labels = ref(null);

  const getList = computed(() => {
    if (list.value) {
      return itemService.getGroupsByLabels(list.value);
    }
  });
  // const getSelectedItems = computed(() => selectedItems?.value);

  const getLabels = computed(() => labels.value);

  async function setLabels() {
    labels.value = await itemService.getLabels(
      getList.value,
      userStore.getUser
    );
  }

  async function loadList() {
    try {
      const items = await itemService.query();
      list.value = items;
      setLabels();
    } catch (error) {
      console.debug("Failed to load list", error);
      // useAppStore().logError(error, false);
      showErrorMsg("Failed to load list, please try again later");
    }
  }

  function setItemsFromShearedList(itemsIds) {
    const user = userStore.loggedUser;
    const userItems = user.selectedItems;
  
    list.value = list.value.map((item) => {
      if (itemsIds.includes(item._id)) {
        // console.log("item selected", item);
        item.isSelected = true;
        if (userItems.find((i) => i._id === item._id)) {
          return item;
        }
        userItems.push(item);
      }
      return item;
    });
    // userStore.updateUser("selectedItems", userItems);
    userStore.updateUserItems(userItems);
  }
  
  function updateLabel(label) {
    labels.value = itemService.updateLabel(label);
    showSuccessMsg("Label updated successfully");
  }
  
  function toggleSelect(itemId) {
    // debugger;
    console.trace()
    const itemIdx = list?.value.findIndex((item) => item._id === itemId);
    const item = list.value[itemIdx];
    item.isSelected = !item.isSelected;

    list.value.splice(itemIdx, 1, item);
    
    let { selectedItems } = userStore.loggedUser;
  
    if (item.isSelected) {
      selectedItems.push(item);
    } else {
      selectedItems = selectedItems.filter((i) => i._id !== itemId);
    }
    
   
    userStore.updateUserItems(selectedItems);
    // userStore.updateUser(
    //   "selectedItems",
    //   JSON.parse(JSON.stringify(selectedItems))
    // );
  }

  return {
    loadList,
    getList,
    toggleSelect,
    // getSelectedItems,
    getLabels,
    updateLabel,
    setItemsFromShearedList,
  };
});
