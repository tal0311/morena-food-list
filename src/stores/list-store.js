import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { itemService } from "@/services/item.service.local";
import { showUserMsg, showErrorMsg, showSuccessMsg } from "@/services/event-bus.service";
import { useAppStore } from "@/stores/app-store";
import { useUserStore } from "@/stores/user-store";
import { userService } from "@/services/user.service";

export const useListStore = defineStore("list", () => {
  const userStore = useUserStore();


  const list = ref(null);
  // const selectedItems = ref([]);
  // const currLang = ref("en");
  const labels = ref(null)

  const getList = computed(() => {
    if (list.value) {

      return itemService.getGroupsByLabels(list.value);
    }

  });
  // const getSelectedItems = computed(() => selectedItems?.value);

  const getLabels = computed(() => labels.value)

  // this is to wait for the list to be loaded before setting the labels from local storage or from list
  // labels in local storage will contain all the user input for labels
  // watchEffect(() => {
  //   if (list.value) {
  //     setLabels()
  //   }
  // });

  // const user =computed(()=>)

  async function setLabels() {
    labels.value = await itemService.getLabels(getList.value, userStore.getUser);
  }


  async function loadList() {
    try {
      const items = await itemService.query();
      list.value = items;
      setLabels()

    } catch (error) {
      console.debug("Failed to load list", error);
      // useAppStore().logError(error, false);
      showErrorMsg("Failed to load list, please try again later");

    }

  }

  

  
  function setItemsFromShearedList(itemsIds) {

    const user =userStore.loggedUser
    const userItems = user.selectedItems;
      console.log('shared list');
     list.value= list.value.map((item) => {
        if (itemsIds.includes(item._id)) {
          item.isSelected = true;
          if (userItems.find((i) => i._id === item._id)) {
            return item;
          }
          userItems.push(item);
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

    const itemIdx = list?.value.findIndex((item) => item._id === itemId);
    const item = list.value[itemIdx];
    item.isSelected = !item.isSelected;
    console.log(item);
    list.value.splice(itemIdx, 1, item);

    let {selectedItems} = userStore.loggedUser
    console.log('items',selectedItems);
    if (item.isSelected) {
      selectedItems.push(item);
    } else {
      selectedItems = selectedItems.filter((i) => i._id !== itemId);
    }

    console.log('after selected', selectedItems);
    userStore.updateUser('selectedItems', JSON.parse(JSON.stringify(selectedItems)))
  }


  return {
    loadList,
    getList,
    toggleSelect,
    // getSelectedItems,
    getLabels,
    updateLabel,
    setItemsFromShearedList
  };
});
