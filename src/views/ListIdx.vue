<template>
    <section v-if="groupList" class="list-idx grid">
        <div id="list-container" class="list-container grid">
            <details v-for="label, idx in labelList" :key="label" :class="`list-details ${label}`">
                <summary>{{ $trans(label) }}</summary>
                <ItemList :list="groupList[label]" @selectItem="toggleSelect" />
            </details>
        </div>
        <footer id="footer-container" class="footer-container">
            <button class="primary-btn done" @click.stop="onDone" v-html="$svg('done')"></button>
        </footer>
        <RouterView />
        <AppModal :isModalOpen="isModalOpen" @reset-modal="isModalOpen = false" />
    </section>
    <AppLoader v-else />
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onBeforeMount, computed, watchEffect, onMounted } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import AppModal from '@/components/AppModal.vue'
import { useTour } from '@/composables/useTour.js'
import { useAppStore } from '@/stores/app-store'
import AppLoader from '@/components/AppLoader.vue'


const listStore = useListStore()
const labelList = ref(null)

// TODO : move this to store make it work from js delivery
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
const appStore = useAppStore()
const isTourActive = computed(() => appStore.getIsTourActive)

// set timeout is to make sure the dom is rendered before the tour starts
onMounted(() => {
    setTimeout(() => {
        if (isTourActive.value) {
            document.querySelectorAll('details').forEach((el, idx) => {
                if (idx === 0) {
                    el.setAttribute('open', true)
                }
                useTour(route.name)
            })
        }
    }, 800);
})




// TODO: convert all css to nested css
</script>

<style scoped>
.list-idx {
    display: grid;
    height: 100%;
    width: 100%;
}

.list-container {
    margin-block-start: 1rem;
    margin-bottom: auto;
    gap: 1rem;
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

.done {
    padding: 0.8rem 0.8rem;
}


details {
    box-shadow: 0 0 2px 0px var(--clr4);
    /* outline: 1px solid #c9c9c9; */
    border-radius: 2px;
    padding: 0.5em 0.5em 0;

    summary {
        position: relative;
        font-weight: bold;
        margin: -0.5em -0.5em 0;
        padding: 0.5em;
        color: var(--clr7);

        &::marker {
            color: var(--clr7);
            /* content:'' */
        }
    }

    &[open] {
        padding: 0.5em;
    }

    &[open] summary {
        /* box-shadow: 0 0 2px 0px #c9c9c9; */
        margin-bottom: 0.5em;
    }
}
</style>