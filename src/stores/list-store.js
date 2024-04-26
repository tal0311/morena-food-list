import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { itemService } from '@/services/item.service.local'

export const useListStore = defineStore('list', () => {

  const list = ref(null)
  const selectedItems = ref(null)
  
  const getList = computed(() => list?.value) 
  const getSelectedItems = computed(() => selectedItems?.value)

  async function loadList() {
    list.value = await itemService.query()
  }

  function toggleSelect(itemId) {
    console.log('itemId', itemId);
  //   const item = list.value.find(item => item._id === itemId)
  //   console.log('item', item.isSelected);
  // item.isSelected = !item.isSelected
  //   console.log('item', item.isSelected);
    
  
    // item?.value.splice(list.value.findIndex(item => item._id === itemId), 1, item)
    // selectedItems.value.push(item)

    // console.log('selectedItems', selectedItems.value);
  }
  return {loadList, getList, toggleSelect , getSelectedItems}
})
