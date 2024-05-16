<template>
    <dialog ref="dialogRef" @click="slickOutSide" class="blur-bg">
        <component :is="modalTYpe" @resetModal="resetModal" :info="modalInfo" />
    </dialog>
</template>

<script setup>
//TODO: convert btns to loop 
import { watchEffect, ref, computed, shallowRef, onBeforeMount } from 'vue';
import { showSuccessMsg, eventBus } from '@/services/event-bus.service';
import ModalDone from '@/components/modal/ModalDone.vue';
import ModalInfo from '@/components/modal/ModalInfo.vue';


const dialogRef = ref(null)
const isModalOpen = ref(false)
const modalTYpe = shallowRef(null)

const modalInfo = ref(null)

onBeforeMount(() => {
    eventBus.on('toggle-modal', setModal)
})

function setModal({ type, info }) {
    console.log(type, info);
    isModalOpen.value = !isModalOpen.value

    switch (type) {
        case 'ModalInfo':
            modalTYpe.value = ModalInfo
            modalInfo.value = info
            break;
        default:
            modalTYpe.value = ModalDone
            break;
    }
}

watchEffect(() => {
    console.log(isModalOpen.value);
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

function slickOutSide(ev) {
    if (!ev.target.classList.contains('actions-container')) {
        isModalOpen.value = false
    }
}



</script>


<style scoped>
button {
    padding: 0.8rem;
}

dialog.blur-bg {
    /* width: 60%; */
    border: none;
    padding: 1rem;
    border-radius: var(--br);
    max-height: 80vh;

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