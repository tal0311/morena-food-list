<template>

    <section class="summary-view grid blur-bg">

        <div id="list-container">
            <ItemList v-if="selectItems" :list="selectItems" @selectItem="toggleSelectItem">
                <h3>{{ $trans('list-results') }}</h3>
            </ItemList>
            <section v-else class="no-items grid">
                <h3>{{ $trans('no-items-to-show') }}</h3>

                <div class="svg-placeholder grid" v-html="$svg('list')"></div>
            </section>
        </div>

        <div id="chart-container">
            <div v-if="chartData && chartData?.length" class="summary-charts">
                <h3>{{ $trans('chart-results') }}</h3>
                <DashBoard :chartData="chartData" :labels="labels" :key="cmpKey" />
            </div>
            <div v-else>
                <h3>{{ $trans('no-chart-items') }}</h3>
                <div class="svg-placeholder grid" v-html="$svg('chart')"></div>
            </div>
        </div>

        <footer>
            <button class="secondary-btn" @click="onBack">{{ $trans('back') }}</button>
        </footer>

    </section>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import DashBoard from '@/components/DashBoard.vue'
import { itemService } from '@/services/item.service.local.js'
import { useGlobals } from '@/composables/useGlobals';




const listStore = useListStore()
const { $trans } = useGlobals()


let chartData = ref(null)
let labels = ref(null)

const cmpKey = ref(0)
const selectItems = computed(() => listStore.getListForSummary)

watchEffect(() => {
    if (selectItems.value) {
        prepDataForChart()
    }
})

function prepDataForChart() {
    const data = itemService.prepDataForChart(selectItems.value)
    chartData.value = Object.values(data)
    labels.value = Object.keys(data).map((label) => $trans(label))
    // this is for forcing the chart component to render when data changes
    cmpKey.value++
}


function toggleSelectItem({ item }) {
    listStore.toggleSelect({ labelName: item.group, itemId: item._id })

}

const route = useRoute()
const router = useRouter()

function onBack() {
    const query = {}
    for (const key in route.query) {
        if (key !== 'print') {
            query[key] = route.query[key]
        }
    }
    router.push({ name: 'list', params: route.params, query: query })
}



</script>

<style scoped>
.summary-view {
    position: fixed;
    width: 95vw;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow-y: auto;
    height: 90vh;
    align-content: space-between;
    backdrop-filter: blur(10px);

    &>*:not(footer) {
        text-align: center;
    }
}



.svg-placeholder {
    place-content: center;
    opacity: 0.5;
}

footer button {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
}
</style>