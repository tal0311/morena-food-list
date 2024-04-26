<template>
    <section class="summary-view">


        <!-- <pre>{{ selectItems }}</pre> -->
        <ItemList v-if="selectItems.length" :list="selectItems"/>
        <section v-else class="no-items grid">
            <h2>No items for display, check them in you list</h2>
        </section>

        <div v-if="chartData" class="summary-charts">
            <h2>Summary Charts</h2>
            <p>Here are some charts to help you understand your list better</p>
            <DashBoard :chartData="chartData" />
        </div>
        <div v-else>
            <h2>Summary Charts</h2>
            <p>There are no items selected for charting</p>
        </div>

        <footer>
            <button @click="$router.push({ name: 'list' })">Back</button>
        </footer>


    </section>
</template>

<script setup>
import { ref, onBeforeMount, computed, watchEffect, watch } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import DashBoard from '@/components/DashBoard.vue'
import { itemService } from '@/services/item.service.local.js'
console.log('ItemService',);

const listStore = useListStore()

const selectItems = computed(() => listStore.getSelectedItems)

let chartData = ref(null)


onBeforeMount(() => {
    if (selectItems.value.length) {
        selectItems.value
        chartData = itemService.prepDataForChart(JSON.parse(JSON.stringify(selectItems.value)))
    }
})

</script>

<style scoped>
.summary-view {

    position: fixed;
    width: 80vw;

    background-color: white;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow-y: auto;
    height: 90vh;


}
</style>