<template>
    <!-- {{ groupList }} -->
    <section v-if="groupList && labelList" ref="listRef" class="list-idx grid">

        <div id="list-container" class="list-container grid">
            <GroupList :labelList="labelList" :groupList="groupList" :labelOrder="labelOrder" @selectItem="toggleSelectItem"
                @toggleEdit="changeBtnState('edit')" @updateLabel="updateLabel" />
            <details>
                <summary>{{ $trans('personal-notes') }}</summary>
                <section class="notes-container">
                    <textarea @focus="changeBtnState('edit')">{{ user.personalTxt || 'No entries' }}</textarea>

                </section>
            </details>
        </div>
        <footer id="footer-container" :class="['footer-container']">
            <div @contextmenu.prevent="clearItems">
                <button :class="`primary-btn ${btnState}`" @click.stop="mainAction" v-html="$svg(btnState)"></button>
            </div>
        </footer>
        <AppModal />
    </section>
    <AppLoader v-else />
    <RouterView />
</template>

<script setup>
// TODO: able to edit personal notes
// TODO: clear user selected items when the user leaves the page
// TODO: DND to change the order of the groups
// TODO: add a button to clear all the selected items add clear items progress bar
import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, computed, onUnmounted, onMounted, watchEffect, onUpdated } from 'vue'
import { useListStore } from '@/stores/list-store';

import { useAppStore } from '@/stores/app-store'

import { eventBus } from '@/services/event-bus.service';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useUserStore } from '@/stores/user-store';


import GroupList from '@/components/GroupList.vue';
import AppLoader from '@/components/AppLoader.vue';
import AppModal from '@/components/AppModal.vue';
import { listService } from '@/services/list.service.js';

const route = useRoute()
const router = useRouter()

const listStore = useListStore()
const userStore = useUserStore()
// loading the list from the route guard
const groupList = computed(() => {
    // console.log(listStore?.getItemList);
    // console.log('groupList computed');
    return listStore.getItemList
})
const labelList = ref(null)
const labelOrder = ref(null)

const user = computed(() => userStore.getUser)

watchEffect(() => {
    if (user.value) {
        labelOrder.value = user.value.labelOrder
        labelList.value = user.value.labels
       
    }

})


const subscriptions = []
const cmpKey = ref(0)
onBeforeMount(async () => {
    console.log('listIdx mounted');
    await loadItems()
    await getDataFromRoute()
})


async function loadItems() {
    await listStore.loadItems()
}

// const sharedIds = ref(null)
async function getDataFromRoute() {

    // debugger
    const { share, ids } = route.query
    const { listId } = route.params

    if (ids) {
        const list = listStore.createShearedList(ids)

        router.push({ path: `list/${list._id}`, query: { share: true } })

    }
    if (share && listId) {
    
        listStore.loadSharedList()

    }

    if (listId && !share) {
        await loadList(listId)
    }


}

async function loadList(listId) {
    const list = await listService.getById(listId)
    listStore.setCurrList(list)
}




async function clearItems() {
    console.debug('clear items');
    if (btnState.value === 'done') {
        // debugger

        listStore.clearItems()
        router.push({ name: 'list', query: {} })
        // location.reload()
        showSuccessMsg('itemsCleared')
        return
    }
}

function toggleSelectItem($event) {
    // console.trace()

    listStore.toggleSelect($event)
}

// changing the state of the button for the main action icon
const btnState = ref('done')
const label = ref({ name: '', userInput: '' })

function mainAction() {

    if (btnState.value === 'edit') {
        submitLabel()
        changeBtnState('done')
        return

    }



    const modalType = btnState.value === 'history' ? 'ModalHistory' : 'ModalDone'

    eventBus.emit('toggle-modal', { type: modalType })

}


function changeBtnState(val) {
    btnState.value = val
}


function updateLabel(updateLabel) {
    console.log('updateLabel', updateLabel);
    label.value = { ...updateLabel }
}

function submitLabel() {
    listStore.updateLabel(label.value)
}



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

    textarea {

        border: 1px solid var(--bClr1);
        border-radius: 2px;
        font-size: 1.5rem;
        font-family: inherit;
        color: var(--clr7);
    }

    p {
        margin: 0;
        padding: 0.5rem;
    }

}
</style>

<!-- height: 80vh;
overflow-y: auto;
overflow-x: hidden; -->