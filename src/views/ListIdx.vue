<template>

    <!-- <pre>{{ groupList }}</pre> -->
    <section class="list-idx grid">
        <!-- <ItemList :list="list" /> -->
        <details v-for="label in labelList" :key="label">
            <summary >{{ label }}</summary>
            <ItemList :list="groupList[label]" />
        </details>

        <footer>
            <button @click="onTakeTour">Show me summery</button>
            <button @click="onPrintList">Print my list</button>
        </footer>

        <RouterView />
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onBeforeMount, computed, watchEffect, watch } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
const router = useRouter()
const listStore = useListStore()
const labelList = ref(null)

const groupList = computed(() => listStore?.getList?.reduce((acc, item) => {
    if (!acc[item.group]) {
        acc[item.group] = []
    }
    acc[item.group].push(item)
    return acc
}, {}))

watchEffect(() => {
    if(groupList.value) {
        labelList.value = Object.keys(groupList.value)
    }
})

onBeforeMount(() => {
    listStore.loadList()
})

const onTakeTour = () => {
    router.push('list/summary')
}

const onPrintList = () => {
    window.print()
}
</script>

<style scoped>

summary{
    text-transform: capitalize;
    font-size: 1.5rem;
    cursor: pointer;

}
</style>