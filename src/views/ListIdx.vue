<template>
    <section v-if="groupList" class="list-idx grid">
        <div class="list-container">
            <details class="list-details" v-for="label in labelList" :key="label">
                <summary>{{ $trans(label) }}</summary>
                <ItemList :list="groupList[label]" @selectItem="toggleSelect" />
            </details>
        </div>
        <footer class="footer-container">
            <button @click="onDone" v-html="$svg('done')"></button>
        </footer>
        <RouterView />
        <AppModal :isModalOpen="isModalOpen" />
    </section>
    <section v-else>
        loading...
    </section>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onBeforeMount, computed, watchEffect, watch, onMounted } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import AppModal from '@/components/AppModal.vue'
import { useTour } from '@/composables/useTour.js'


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
function onDone() {
    isModalOpen.value = !isModalOpen.value
}

function toggleSelect(id) {
    listStore.toggleSelect(id)
}

const route = useRoute()
watchEffect(() => {
    if (groupList.value) {
        useTour(route.name)
    }
})





</script>

<style scoped>
.list-idx {
    display: grid;
    height: 100%;
    width: 100%;
}

.list-container {
    margin-bottom: auto;
}

footer {
    position: fixed;
    bottom: 3rem;
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