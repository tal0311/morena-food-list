<template>
    <section v-if="groupList && labelList" ref="listRef" class="list-idx grid"  >
        <div id="list-container" class="list-container grid">
            <GroupList :labelList="labelList" :groupList="groupList" :sharedIds="sharedIds" @selectItem="toggleSelect"
                @toggleEdit="toggleEdit" @updateLabel="updateLabel" />
        </div>
        <footer id="footer-container" :class="['footer-container']">
            <button :class="`primary-btn ${btnState}`" @click.stop="onDone" v-html="$svg(btnState)"></button>
        </footer>
        <AppModal />
    </section>
    <AppLoader v-else />
    <RouterView />
</template>

<script setup>

import { useRoute } from 'vue-router'
import { ref, onBeforeMount, computed, onUnmounted, onMounted, watch, onUpdated } from 'vue'
import { useListStore } from '@/stores/list-store';
import AppModal from '@/components/AppModal.vue'
import { useTour } from '@/composables/useTour.js'
import { useAppStore } from '@/stores/app-store'
import AppLoader from '@/components/AppLoader.vue'
import GroupList from '@/components/GroupList.vue'
import { eventBus } from '@/services/event-bus.service';
import { showSuccessMsg } from '@/services/event-bus.service';


const route = useRoute()

const listStore = useListStore()
// loading the list from the route guard
const groupList = computed(() => listStore?.getList)
const labelList = computed(() => listStore?.getLabels)

onBeforeMount(async () => {
    
    getDataFromRoute()
})

onMounted(() => {
    showSuccessMsg('Swipe item and click on the checkbox to select it')
})


const counter = ref(0)

const sharedIds = ref(null)

function getDataFromRoute() {
    // console.log(route.query);

    const { share, ids } = route.query
    if (share && ids) {
        sharedIds.value = ids.split(',')
    }
}

let subscribe = null
function onDone() {
    if (btnState.value === 'edit') {
        submitLabel()
        btnState.value = 'done'
        return
    }
    subscribe = eventBus.emit('toggle-modal', { type: 'ModalDone' })

}

function toggleSelect(id) {

    listStore.toggleSelect(id)
}

const btnState = ref('done')
const currLabel = ref('')
function toggleEdit(labelName) {
    currLabel.value = labelName
    btnState.value = 'edit'
}


const label = ref({ name: '', userInput: '' })
function updateLabel(updateLabel) {
    label.value = { ...updateLabel }
}

function submitLabel() {
    listStore.updateLabel(label)
}



const appStore = useAppStore()
const isTourActive = computed(() => appStore.getIsTourActive)

// set timeout is to make sure the dom is rendered before the tour starts
// onMounted(() => {
//     setTimeout(() => {
//         if (isTourActive.value) {
//             document.querySelectorAll('details').forEach((el, idx) => {
//                 if (idx === 0) {
//                     el.setAttribute('open', true)
//                 }
//                 useTour(route.name)
//             })
//         }
//     }, 800);
// })


onUnmounted(() => {
    if (subscribe) {
        subscribe()
    }
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
    margin-bottom: 10rem;
    gap: 1rem;
}

footer {
    position: fixed;
    bottom: 3rem;
    left: 50%;
    display: grid;
    place-content: center;
    transform: translateX(-50%);
    transition: translate 0.2s;
}

.done {
    padding: 0.8rem 0.8rem;
    /* background-color: var(--clr4); */
}

.edit {
    padding: 0.8rem 0.8rem;
    color: var(--bClr2);
    background-color: var(--clr36);
}


details {
    box-shadow: 0 0 2px 0px var(--clr4);
    /* outline: 1px solid #c9c9c9; */
    border-radius: 2px;
    padding: 0.5em 0.5em 0;

    summary {
        display: grid;
        align-items: center;
        position: relative;
        font-weight: bold;
        margin: -0.5em -0.5em 0;
        padding: 0.5em;
        color: var(--clr7);
        text-transform: capitalize;
        font-size: 1.5rem;
        cursor: pointer;

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


.summary-container {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    width: 100%;
    /* justify-content: space-between; */
    gap: 1rem;
}

.more-btn {
    all: unset;
    display: grid;
    place-content: center;
}

textarea {
    margin-block: 1rem;
    outline: 1px solid var(--bClr1);
    resize: none;
    width: 100%;
    border: none;
    padding: 0.3rem;
    font-family: inherit;
    font-size: 1.5rem;
}
</style>

<!-- height: 80vh;
overflow-y: auto;
overflow-x: hidden; -->