<template>
    <section class="summary-view grid">


        <!-- <pre>{{ selectItems }}</pre> -->
      
        <ItemList v-if="selectItems.length" :list="selectItems">
            <h4>{{ $trans('list-results') }}</h4>
        </ItemList>
        <section v-else class="no-items grid">
            <h2>{{ $trans('no-items-to-show') }}</h2>

            <div class="svg-placeholder grid" v-html="$svg('list')"></div>
        </section>
        
        <div v-if="chartData" class="summary-charts">
            <h4>{{ $trans('chart-results') }}</h4>
            <DashBoard :chartData="chartData" :labels="labels"/>
        </div>
        <div v-else>
            <h2>{{ $trans('no-chart-items') }}</h2>
            <div class="svg-placeholder grid" v-html="$svg('chart')"></div>
        </div>

        <footer>
            <button @click="$router.push({ name: 'list' })">{{ $trans('back') }}</button>
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

.svg-placeholder{
    place-content: center;
    opacity: 0.5;
}

footer button{
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
}
</style>