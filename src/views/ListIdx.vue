<template>
    <!-- {{ groupList }} -->
    <section v-if="groupList && labelList" ref="listRef" class="list-idx grid">

        <div id="list-container" class="list-container grid">
            <GroupList :labelList="labelList" :groupList="groupList" :labelOrder="labelOrder"
                @selectItem="toggleSelectItem" @toggleEdit="changeBtnState('edit')" @updateLabel="updateLabel" />
            <details>
                <summary>{{ $trans('personal-notes') }}</summary>
                <section class="notes-container">
                    <textarea @focus="changeBtnState('edit')"
                        @blur="updateUserText">{{ user.personalTxt || $trans('personal-notes') }}
                    </textarea>

                </section>
            </details>
        </div>
        <footer class="footer-container">
            <div @contextmenu.prevent="clearItems">
                <button :class="`primary-btn ${btnState}`" @click.stop="mainAction" v-html="$svg(btnState)"></button>
            </div>
        </footer>
        <!-- <AppModal /> -->
    </section>
    <AppLoader v-else />
    <RouterView />
</template>

<script setup>


import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, computed, onUnmounted, watchEffect } from 'vue'
import { useListStore } from '@/stores/list-store';

import { eventBus } from '@/services/event-bus.service';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useUserStore } from '@/stores/user-store';

import GroupList from '@/components/GroupList.vue';
import AppLoader from '@/components/AppLoader.vue';
// import AppModal from '@/components/AppModal.vue';
import { listService } from '@/services/list.service.js';

const route = useRoute()
const router = useRouter()

const listStore = useListStore()
const userStore = useUserStore()

const groupList = computed(() => {
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

async function getDataFromRoute() {
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
        listStore.clearItems()
        router.push({ name: 'list', query: {} })
        showSuccessMsg('itemsCleared')
        return
    }
}

function toggleSelectItem($event) {
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

function updateUserText(event) {
    userStore.updateUser('personalTxt', event.target.value)
    changeBtnState('done')
}

onUnmounted(() => {
    subscriptions.forEach(sub => sub())
})

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
    width: 100%;

    button {
        box-shadow: 0 0 1px 2px var(--clr2);

        &:active {
            box-shadow: none;
        }

    }

}


:is(.done, .edit, .history) {
    padding: 0.8rem 0.8rem;

}

.edit {
    color: var(--bClr2);
    background-color: var(--clr36);
}

.history {
    background-color: var(--clr11);

}


details {
    box-shadow: 0 0 2px 0px var(--clr4);
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
