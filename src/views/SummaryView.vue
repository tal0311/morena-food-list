<template>
    <section class="summary-view grid blur-bg">
        <div id="list-container">
            <ItemList v-if="selectItems.length" :list="selectItems" @selectItem="toggleSelect">
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
            <button class="secondary-btn" @click="$router.push({ name: 'list' })">{{ $trans('back') }}</button>
        </footer>

    </section>
</template>

<script setup>
import { ref, onBeforeMount, computed, watch, onMounted } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import DashBoard from '@/components/DashBoard.vue'
import { itemService } from '@/services/item.service.local.js'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app-store'
import { useTour } from '@/composables/useTour.js'

// TODO: fix chart labels and data to human readable
const listStore = useListStore()

let chartData = ref(null)
let labels = ref(null)

const cmpKey = ref(0)
const selectItems = computed(() => listStore.getSelectedItems)

watch(selectItems, (newVal, oldVal) => {
    if (oldVal !== newVal) {
        prepDataForChart()
        return
    }
},
    { deep: true },
    { immediate: true }
)



onBeforeMount(() => {
    prepDataForChart()
})

function prepDataForChart() {
    const data = itemService.prepDataForChart(JSON.parse(JSON.stringify(selectItems.value)))
    if (!Object.keys(data).length === 0) return
    chartData.value = Object.values(data)
    labels.value = Object.keys(data)
    // this is for forcing the chart component to render when data changes
    cmpKey.value++
}

function toggleSelect(id) {
    listStore.toggleSelect(id)
}

// Tour logic
const route = useRoute()
const appStore = useAppStore()
const isTourActive = computed(() => appStore.getIsTourActive)

onMounted(() => {
    if (isTourActive.value) {
        useTour(route.name)
    }
    if (route.query.print) {
        setTimeout(() => {
            window.print()
        }, 1000)
    }
})


</script>

<style scoped>
.summary-view {
    position: fixed;
    width: 80vw;
    /* background-color: white; */
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