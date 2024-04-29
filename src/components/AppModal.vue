<template>
    <dialog ref="dialogRef" class="blur-bg">
        <div class="actions-container grid">
            <button class="secondary-btn" @click="onPrintList">{{ $trans('print') }}</button>
            <button class="secondary-btn" @click="onShowSummary">{{ $trans('summary') }}</button>
            <button class="secondary-btn" @click="onSendList">{{ $trans('send-to-moran') }}</button>
            <button class="secondary-btn" @click="closeModal">{{ $trans('back') }}</button>
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
dialog.blur-bg{
    width: 60%;
    border: none;
    padding: 1rem;
    border-radius: var(--br);

}
.actions-container{
    gap: 1rem;
}
</style>