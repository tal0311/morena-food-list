<template>
    <dialog ref="dialogRef" @click="clickOutSide" :class="`app-modal blur-bg ${modalClass} ${addedClasses}`">

        <component :is="modalTYpe" @resetModal="closeModal" :info="modalInfo && modalInfo" @modifyModal="modifyModal" />
    </dialog>
</template>

<script setup>

import { watchEffect, ref, computed, shallowRef, onBeforeMount, onUnmounted } from 'vue';
import { showSuccessMsg, eventBus } from '@/services/event-bus.service';
import ModalDone from '@/components/modal/ModalDone.vue';
import ModalInfo from '@/components/modal/ModalInfo.vue';
import ModalHistory from '@/components/modal/ModalHistory.vue';
import ModalAddUser from '@/components/modal/ModalAddUser.vue';
import ModalLock from '@/components/modal/ModalLock.vue';
import ModalAddList from '@/components/modal/ModalAddList.vue';
import ModalAddItem from '@/components/modal/ModalAddItem.vue';

const dialogRef = ref(null)
const isModalOpen = ref(false)
const modalTYpe = shallowRef(null)
const modalInfo = ref(null)
const modalClass = ref(null)
const subscription = []
const addedClasses = ref('')

onBeforeMount(() => {
    // to handle multiple subscriptions
    subscription[0] = eventBus.on('toggle-modal', setModal)
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
            break;
        case 'ModalLock':
            modalTYpe.value = ModalLock
            break;
        case 'ModalAddList':
            modalTYpe.value = ModalAddList
            break;
        case 'ModalAddItem':
            modalInfo.value = info
            modalTYpe.value = ModalAddItem
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
}


function clickOutSide(ev) {
    if (modalClass.value === 'ModalLock') return
    if (ev.target.classList.contains('app-modal')) {
        isModalOpen.value = false
    }
}




</script>


<style scoped>
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

dialog.blur-bg:not(.ModalInfo, .ModalAddItem) {
    width: 70%;

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
    /* transform: translateY(100%); */
    backdrop-filter: blur(0);

    &::backdrop {
        background-color: rgba(0, 0, 0, 0.2);
    }

    height: 7vh;
    overflow: hidden;

}
</style>