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
import { ref, onBeforeMount, computed, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import DashBoard from '@/components/DashBoard.vue'
import { itemService } from '@/services/item.service.local.js'
import { useUserStore } from '@/stores/user-store';



// TODO: fix chart labels and data to human readable
const listStore = useListStore()
const userStore = useUserStore()
let chartData = ref(null)
let labels = ref(null)

const cmpKey = ref(0)
const selectItems = computed(() => listStore.getListForSummary)

watchEffect(() => {
    if (selectItems.value) {
        console.log(selectItems.value);
        prepDataForChart()
    }

})



function prepDataForChart() {
    const data = itemService.prepDataForChart(selectItems.value)
    // if (!Object.keys(data).length === 0) return
    // console.log(data);
    chartData.value = Object.values(data)
    labels.value = Object.keys(data)
    // this is for forcing the chart component to render when data changes
    cmpKey.value++
}

watchEffect(()=>{
    if (chartData.value) {
        // console.log(chartData.value);
        // console.log(labels.value);
        
    }
})



function toggleSelectItem({ item }) {
    console.log(item);
      listStore.toggleSelect({labelName: item.group, itemId: item._id})
    // userStore.toggleSelectItem(item)
}

const route = useRoute()
const router = useRouter()

watchEffect(() => {
    const { print } = route.query;

    if (print === 'true') {
        setTimeout(() => {
            window.print()
        }, 500)
    }
})


function onBack() {

    const query = {}

    for (const key in route.query) {
        if (key !== 'print') {
            query[key] = route.query[key]
        }

    }


    router.push({ name: 'list',params:route.params , query: query })
}


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