<template>
    <section v-if="groupList && labelList" ref="listRef" class="list-idx grid">
        <div id="list-container" class="list-container grid">
            <GroupList :labelList="labelList" :groupList="groupList" @selectItem="toggleSelect" @toggleEdit="toggleEdit"
                @updateLabel="updateLabel" />
            <details>
                <summary>{{ $trans('personal-notes') }}</summary>
                <section class="notes-container">
                    <p>{{ user.personalTxt }}</p>

                </section>
            </details>
        </div>
        <footer id="footer-container" :class="['footer-container', isHistoryMode ? 'blur-bg' : '']">

            <button v-if="!isHistoryMode" :class="`primary-btn ${btnState}`" @click.stop="onDone"
                v-html="$svg(btnState)"></button>
            <section v-else class="history-actions grid grid-dir-col">
                <button class="primary-btn" @click="onSelectHistory">Continue</button>
                <RouterLink to="/user">
                    <button class="primary-btn">Back</button>
                </RouterLink>
            </section>

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
import AppModal from '@/components/AppModal.vue'
import { useAppStore } from '@/stores/app-store'
import AppLoader from '@/components/AppLoader.vue'
import GroupList from '@/components/GroupList.vue'
import { eventBus } from '@/services/event-bus.service';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useUserStore } from '@/stores/user-store';


const route = useRoute()
const router = useRouter()

const listStore = useListStore()
const userStore = useUserStore()
// loading the list from the route guard
const groupList = computed(() => listStore?.getList)
const labelList = computed(() => listStore?.getLabels)
const user = computed(() => userStore.getUser)

onBeforeMount(() => {
    getDataFromRoute()
})

onMounted(() => {
    const msg = isHistoryMode.value
        ? 'To continue from this history click continue'
        : 'Swipe item and click on the checkbox to select it'
    showSuccessMsg(msg)
})


// const counter = ref(0)

const sharedIds = ref(null)
const isHistoryMode = ref(false)
function getDataFromRoute() {

    const { share, ids, history } = route.query
    if (share && ids) {
        sharedIds.value = ids.split(',')

    }
    if (history) {
        isHistoryMode.value = true
    }
}

watchEffect(() => {
    if (groupList.value && sharedIds.value) {
        listStore.setItemsFromShearedList(sharedIds.value)
    }
})
function onSelectHistory() {
    const { history } = route.query
    if (history) {
        const query = {}
        for (const key in route.query) {
            if (key !== 'history') {
                query[key] = route.query[key]
            }

        }

        router.push({ name: 'list', query })
        isHistoryMode.value = false
        showSuccessMsg('History restored')
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
    width: 100%;
    /* background-color: aquamarine; */

    &.blur-bg {
        bottom: 4rem;
        padding: 1rem;
        /* background-color: var(--bClr2); */
    }
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