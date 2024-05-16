<template>
    <dialog @click="slickOutSide" ref="dialogRef" class="blur-bg">
        <component :is="modalTYpe" @rest-modal="closeModal"/>
    </dialog>
</template>

<script setup>
//TODO: convert btns to loop 
import { watchEffect, ref, computed, shallowRef } from 'vue';
import { showSuccessMsg } from '@/services/event-bus.service';
import ModalDone from './modal/ModalDone.vue';

const props = defineProps({
    isModalOpen: {
        default: false
    }
})


const dialogRef = ref(null)

const modalTYpe = shallowRef(ModalDone)


watchEffect(() => {
    if (props.isModalOpen && dialogRef.value) {
        openModal()
    }

})

function openModal() {
    dialogRef.value.showModal()
}

//TODO: make this better 
const emit = defineEmits(['reset-modal'])

function closeModal() {
    dialogRef.value.close()
    emit('reset-modal')
}

function slickOutSide(ev) {
    if (!ev.target.classList.contains('actions-container')) {
        closeModal()
    }
}



</script>


<style scoped>
button {
    padding: 0.8rem;
}

dialog.blur-bg {
    width: 60%;
    border: none;
    padding: 1rem;
    border-radius: var(--br);

}

.actions-container {
    gap: 1rem;
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>