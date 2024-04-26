<template>

    <!-- <pre>{{ groupList }}</pre> -->
    <section class="list-idx grid">
        <!-- <ItemList :list="list" /> -->
        <div class="list-container">

            <details v-for="label in labelList" :key="label">
                <summary>{{ label }}</summary>
                <ItemList :list="groupList[label]" @selectItem="toggleSelect" />
            </details>

        </div>

        <footer>
            <button @click="onDone">Done</button>

        </footer>

        
        <RouterView />
        <AppModal :isModalOpen="isModalOpen"/>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onBeforeMount, computed, watchEffect, watch } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import AppModal from '@/components/AppModal.vue'
const router = useRouter()
const listStore = useListStore()
const labelList = ref(null)


// fetch('https://cdn.jsdelivr.net/gh/tal0311/grocery-list/src/data/item.json')
//     .then(response => response.json())
//     .then(data => console.log('data:',data));

onBeforeMount(() => {
    listStore.loadList()
})
const groupList = computed(() => listStore?.getList?.reduce((acc, item) => {
    if (!acc[item.group]) {
        acc[item.group] = []
    }
    acc[item.group].push(item)
    return acc
}, {}))

watchEffect(() => {
    if (groupList.value) {
        labelList.value = Object.keys(groupList.value)
    }
})


const isModalOpen = ref(false)
function onDone(){
    isModalOpen.value = !isModalOpen.value

}






function toggleSelect(id) {
    console.log('toggleSelect', id);
    // listStore.toggleSelect(id)
}
</script>

<style scoped>
.list-idx {
    display: grid;
    /* background-color: lightgreen; */
    height: 100%;
    width: 100%; 

    
    
}
.list-container {
   
    margin-bottom: auto;
}

footer{
  position: fixed;
  bottom: 3rem;
  /* background-color: lightcoral; */
  width: 100%;
  left: 0;
  display: grid;
  place-content: center;
}

summary {
    text-transform: capitalize;
    font-size: 1.5rem;
    cursor: pointer;

}
</style>