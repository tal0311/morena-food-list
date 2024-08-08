<template>
    <dialog ref="dialogRef" @click="clickOutSide" :class="`app-modal blur-bg ${modalClass}`">
        <component :is="modalTYpe" @resetModal="isModalOpen = false" :info="modalInfo && modalInfo" />
    </dialog>
</template>

<script setup>

import { watchEffect, ref, computed, shallowRef, onBeforeMount, onUnmounted } from 'vue';
import { showSuccessMsg, eventBus } from '@/services/event-bus.service';
import ModalDone from '@/components/modal/ModalDone.vue';
import ModalInfo from '@/components/modal/ModalInfo.vue';
import ModalHistory from '@/components/modal/ModalHistory.vue';
import ModalAddUser from '@/components/modal/ModalAddUser.vue';
// src/components/modal/ModalAddUser.vue



const dialogRef = ref(null)
const isModalOpen = ref(false)
const modalTYpe = shallowRef(null)

const modalInfo = ref(null)
const modalClass = ref(null)
const subscription = []
onBeforeMount(() => {
    // to handle multiple subscriptions
    subscription[0] = eventBus.on('toggle-modal', setModal)
})

function setModal({ type, info }) {
    console.log(type, info);
    
    console.debug(type, info);
    isModalOpen.value = true

    modalClass.value = type
    
    // debugger

    switch (type) {
        case 'ModalInfo':
            modalTYpe.value = ModalInfo
            modalInfo.value = info
            
            break;
        case 'ModalHistory':
            modalTYpe.value = ModalHistory
            break;
        case 'ModalAddUser':
            modalTYpe.value = ModalAddUser
            break;
        default:
            modalTYpe.value = ModalDone
            break;
    }
}

watchEffect(() => {
    // console.debug(isModalOpen.value);
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
}

function resetModal() {
    isModalOpen.value = false
}

function clickOutSide(ev) {
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

dialog.blur-bg:not(.ModalInfo) {
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
</style>