<template>
    <dialog ref="dialogRef">
        <div class="actions-container grid">
            <button @click="onPrintList">{{ $trans('print') }}</button>
            <button @click="onShowSummary">{{ $trans('summary') }}</button>
            <button @click="onSendList">{{ $trans('send-to-moran') }}</button>
            <button @click="closeModal">{{ $trans('back') }}</button>
        </div>
    </dialog>
</template>

<script setup>
import { watchEffect, ref } from 'vue';
import {useRouter} from 'vue-router'
import {shareService} from '@/services/share.service.js'

const props = defineProps({
    isModalOpen: {
        default: false
    }
})

const router = useRouter()
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
    closeModal()
    router.push({name: 'list-summary'})
}

function onSendList() {
    closeModal()
     
    shareService.shareTo()
    console.log('onSendList');
}


</script>


<style scoped>
button{
    padding: 0.8rem;
}
dialog{
    width: 50%;
}
.actions-container{
    gap: 1rem;
}
</style>