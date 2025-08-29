<template>
    <dialog v-show="isModalOpen" ref="dialogRef" @click="clickOutSide"
    :class="`app-modal no-scrollbar blur-bg ${modalClass} ${addedClasses} ${isDashboardModal ? 'dashboard-modal' : ''}`">
        <div class="modal-container">
            <component :is="modalTYpe" :info="modalInfo && modalInfo" @resetModal="closeModal" @modifyModal="modifyModal" />
        </div>
    </dialog>
</template>

<script setup>
import { watchEffect, ref, onBeforeMount, computed } from 'vue';
import { showSuccessMsg, eventBus } from '@/services/event-bus.service';
import ModalDone from '@/components/modal/ModalDone.vue';
import ModalInfo from '@/components/modal/ModalInfo.vue';
import ModalHistory from '@/components/modal/ModalHistory.vue';
import ModalAddUser from '@/components/modal/ModalAddUser.vue';
import ModalLock from '@/components/modal/ModalLock.vue';
import ModalAddList from '@/components/modal/ModalAddList.vue';
import ModalAddItem from '@/components/modal/ModalAddItem.vue';
import ModalAddRecipe from '@/components/modal/ModalAddRecipe.vue';

const dialogRef = ref(null)
const isModalOpen = ref(false)
const modalTYpe = ref(null)
const modalInfo = ref(null)
const modalClass = ref(null)
const addedClasses = ref('')

// Dashboard modals that should use the dashboard styling
const dashboardModals = ['ModalAddUser', 'ModalAddItem', 'ModalAddList', 'ModalAddRecipe']

const isDashboardModal = computed(() => {
    return dashboardModals.includes(modalClass.value)
})

onBeforeMount(() => {
    document.addEventListener('keydown', (ev)=>{
        if (ev.key === 'Escape'){
            ev.preventDefault()
        }
    })
    eventBus.on('toggle-modal', setModal)
})



function modifyModal(classToAdd) {
    addedClasses.value = classToAdd
}

function setModal({ type, info }) {

    console.debug('type', type);
    console.debug('info', info);



    isModalOpen.value = true
    modalClass.value = type

    switch (type) {
        case 'ModalInfo':
            modalInfo.value = info
            modalTYpe.value = ModalInfo

            break;
        case 'ModalHistory':
            modalTYpe.value = ModalHistory
            break;
        case 'ModalAddUser':
            modalTYpe.value = ModalAddUser
            modalInfo.value = info
            break;
        case 'ModalLock':
            modalTYpe.value = ModalLock
            break;
        case 'ModalAddItem':
            modalInfo.value = info
            modalTYpe.value = ModalAddItem
            break;
        case 'ModalAddList':
            modalInfo.value = info
            modalTYpe.value = ModalAddList
            break;
        case 'ModalAddRecipe':
            modalInfo.value = info
            modalTYpe.value = ModalAddRecipe
            break;
        default:
            modalTYpe.value = ModalDone
            break;
    }
}

watchEffect(() => {
    if (!dialogRef.value) return
    if (isModalOpen.value) {
        openModal()
    }
    if (!isModalOpen.value) {
        closeModal()
    }
})



function openModal() {
    dialogRef.value.showModal()
}

function closeModal() {
    dialogRef.value.close()
    modalInfo.value = null
    modalClass.value = null
    addedClasses.value = ''
    modalTYpe.value = null
    isModalOpen.value = false
}


function clickOutSide(ev) {
    if (modalClass.value === 'ModalLock') return
    if (ev.target.classList.contains('app-modal')) {
        isModalOpen.value = false
    }
}


</script>


<style scoped>
.app-modal {
    display:grid;
    place-items: center;
    grid-template-columns: 0.2rem 1fr 0.2rem;
    grid-template-rows: 0.2rem 1fr 0.2rem;

    .modal-container{
        grid-column: 2;
        grid-row: 2;
    }

   &.dashboard-modal{
    width: 95vw;
    max-width: 95vw;
    max-height: 90vh;
  
   }
}

button {
    padding: 0.8rem;
}

dialog.blur-bg {
    border: none;
    padding: 1rem;
    border-radius: var(--br);
    max-height: 80vh;
}

dialog.blur-bg.ModalLock {
    backdrop-filter: initial;

    &::backdrop {
        background-color: rgba(94, 94, 94, 0.2);
    }
}

/* Default width for regular modals */
dialog.blur-bg:not(.ModalInfo, .ModalAddItem, .ModalAddRecipe, .ModalAddUser, .ModalAddList) {
    width: 70%;
}

/* Dashboard modal content styles */
.app-modal .modal-container {
    background-color: var(--clr10);
    border-radius: 8px;
    overflow: auto;
    width: 100%;
    height: 100%;
}

dialog.blur-bg::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

.actions-container {
    gap: 1rem;
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.mini {
    backdrop-filter: blur(0);

    &::backdrop {
        background-color: rgba(0, 0, 0, 0.2);
    }

    height: 7vh;
    overflow: hidden;
}


</style>