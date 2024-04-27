<template>
    <section class="summary-view grid">


        <!-- <pre>{{ selectItems }}</pre> -->
      
        <ItemList v-if="selectItems.length" :list="selectItems">
           <p>Here is a list summary of your items</p>
        </ItemList>
        <section v-else class="no-items grid">
            <h2>No items for display, check them in you list</h2>
        </section>

        <div v-if="chartData" class="summary-charts">
            <p>Here are some charts to help you understand your list better</p>
            <DashBoard :chartData="chartData" :labels="labels"/>
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


const listStore = useListStore()

const selectItems = computed(() => listStore.getSelectedItems)

let chartData = ref(null)
let labels = ref(null)

watchEffect(async() => {
    if (selectItems.value.length) {
        const data = itemService.prepDataForChart(JSON.parse(JSON.stringify(selectItems.value)))
        chartData.value = Object.values(data)
        labels.value = Object.keys(data)
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
    align-content: space-between;

}
</style>