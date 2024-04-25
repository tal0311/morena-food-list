import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { itemService } from '@/services/item.service.local'

export const useListStore = defineStore('list', () => {

  const list = ref(null)
  
  const getList = computed(() => list?.value) 

  async function loadList() {
    list.value = await itemService.query()
  }
  return {loadList, getList}
})
