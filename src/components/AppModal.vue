<template>
    <dialog @click="slickOutSide" ref="dialogRef" class="blur-bg">
        <div class="actions-container grid">
            
            <button class="secondary-btn" @click="onPrintList">{{ $trans('print') }}</button>
            <button class="secondary-btn" @click="onShowSummary">{{ $trans('summary') }}</button>
            <button class="secondary-btn" @click="onSendList">{{ $trans('send-to-moran') }}</button>
            <button class="secondary-btn disabled" @click="onRecipe" disabled>{{ 'Recipes (coming soon)' }}</button>
            <button class="secondary-btn" @click="closeModal">{{ $trans('back') }}</button>
        </div>
    </dialog>
</template>

<script setup>
//TODO: convert btns to loop 
import { watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router'
import { shareService } from '@/services/share.service.js'

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

//TODO: make this better 
const emit = defineEmits(['reset-modal'])

function closeModal() {
    dialogRef.value.close()
    emit('reset-modal')
}

function onPrintList() {
    onShowSummary({ print: true })
}

function onShowSummary(query) {
    closeModal()
    router.push({ name: 'list-summary', query: query })
}

function onSendList() {
    closeModal()

    shareService.shareTo()
    console.log('onSendList');
}

function slickOutSide(ev) {
    if (!ev.target.classList.contains('actions-container')) {
        closeModal()
    }
}
function onRecipe() {
    console.log('onRecipe');

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
.disabled{
    opacity: 0.5;
    cursor: not-allowed;
}
</style>