<template>
    <dialog ref="dialogRef">

        <div class="actions-container grid">

            <button @click="onPrintList">Print</button>
            <button @click="onShowSummary">Summary</button>
            <button @click="onSendList">Send to Moran</button>
            <button @click="closeModal">Back</button>
        </div>
    </dialog>
</template>

<script setup>
import { watchEffect, ref } from 'vue';

const props = defineProps({
    isModalOpen: {
        default: false
    }
})

const dialogRef = ref(null)


watchEffect(() => {
    if (props.isModalOpen && dialogRef.value) {
        openModal()
    }

})

function openModal() {
    dialogRef.value.showModal()
}

function closeModal() {
    dialogRef.value.close()
}

function onPrintList() {
    closeModal()
    window.print()
}

function onShowSummary() {
    console.log('onShowSummary');
}

function onSendList() {
    console.log('onSendList');
}


</script>


<style scoped>
.actions-container{
    gap: 1rem;
}
</style>