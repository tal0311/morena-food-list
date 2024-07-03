<template>
    <section v-if="groupList && labelList" ref="listRef" class="list-idx grid">

        <div id="list-container" class="list-container grid">
            <GroupList :labelList="labelList" :groupList="groupList" @selectItem="toggleSelectItem" @toggleEdit="toggleEdit"
                @updateLabel="updateLabel" />
            <details>
                <summary>{{ $trans('personal-notes') }}</summary>
                <section class="notes-container">
                    <p>{{ user.personalTxt }}</p>

                </section>
            </details>
        </div>
        <footer id="footer-container" :class="['footer-container']">
            <button :class="`primary-btn ${btnState}`" @click.stop="mainAction" v-html="$svg(btnState)"></button>
        </footer>
        <AppModal />
    </section>
    <AppLoader v-else />
    <RouterView />
</template>

<script setup>


import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, computed, onUnmounted, onMounted, watchEffect } from 'vue'
import { useListStore } from '@/stores/list-store';

import { useAppStore } from '@/stores/app-store'

import { eventBus } from '@/services/event-bus.service';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useUserStore } from '@/stores/user-store';


import GroupList from '@/components/GroupList.vue';
import AppLoader from '@/components/AppLoader.vue';
import AppModal from '@/components/AppModal.vue';

const route = useRoute()
const router = useRouter()

const listStore = useListStore()
const userStore = useUserStore()
// loading the list from the route guard
const groupList = computed(() => listStore?.getList)
const labelList = computed(() => listStore?.getLabels)
const user = computed(() => userStore.getUser)



const subscriptions =[]
onBeforeMount(async () => {
    // debugger
    await loadItems()
    
    getDataFromRoute()
    subscriptions[0] = eventBus.on('restore-history', () => {
       btnState.value = 'done'
    })

    // loadList()
})

onMounted(() => {
    const msg = 'Swipe item and click on the checkbox to select it'
    showSuccessMsg(msg)
})

async function loadItems(){
    await listStore.loadList()
}

// const sharedIds = ref(null)
function getDataFromRoute() {

    const { history, share, ids } = route.query
    if (ids) {
        // sharedIds.value = 
        const idsFromRoute =ids.split(',')
        // console.log(idsFromRoute);
        listStore.setItemsFromShearedList(idsFromRoute)

    }
    if (share) {
        appStore.setSharedList(true)
    }
    if (history) {
        btnState.value = 'history'

    }

}



// change to modal history instead of 2 btns



function mainAction() {
    if (btnState.value === 'edit') {
        submitLabel()
        btnState.value = 'done'
        return
    }

    const modalType = btnState.value === 'history' ? 'ModalHistory' : 'ModalDone'
    
    eventBus.emit('toggle-modal', { type: modalType })

}

function toggleSelectItem(id) {
    listStore.toggleSelect(id)
}

const btnState = ref('done')
const currLabel = ref('')
function toggleEdit(labelName) {
    currLabel.value = labelName
    btnState.value = 'edit'
}

function setEditMode() {
    
    btnState.value = 'list-edit'
}


const label = ref({ name: '', userInput: '' })
function updateLabel(updateLabel) {
    label.value = { ...updateLabel }
}

function submitLabel() {
    listStore.updateLabel(label)
}

const appStore = useAppStore()

onUnmounted(() => {
    subscriptions.forEach(sub => sub())
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
    width: 100%;
    /* background-color: aquamarine; */

    &.blur-bg {
        bottom: 4rem;
        padding: 1rem;
        /* background-color: var(--bClr2); */
    }
}

/* TODO:refactor btn-state */
.done {
    padding: 0.8rem 0.8rem;
    /* background-color: var(--clr4); */
}

.edit {
    padding: 0.8rem 0.8rem;
    color: var(--bClr2);
    background-color: var(--clr36);
}

.history {
    padding: 0.8rem 0.8rem;
    background-color: var(--clr11);

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

.history-actions {
    /* background-color: aqua; */
    width: 100%;

    grid-auto-columns: 1fr 1fr;
    gap: 1rem;

    button {
        padding: 0.8rem 0.8rem;
        width: 40vw;


    }
}

.notes-container {
    border: 1px solid var(--bClr1);
    border-radius: 2px;
    font-size: 1.5rem;
    font-family: inherit;
    color: var(--clr7);

    p {
        margin: 0;
        padding: 0.5rem;
    }

}
</style>

<!-- height: 80vh;
overflow-y: auto;
overflow-x: hidden; -->