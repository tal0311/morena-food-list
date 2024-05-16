<template>
    <dialog @click="slickOutSide" ref="dialogRef" class="blur-bg">
        <div class="actions-container grid">
            <button class="secondary-btn" @click="onPrintList">{{ $trans('print') }}</button>
            <button class="secondary-btn" @click="onShowSummary">{{ $trans('summary') }}</button>
            <button class="secondary-btn" @click="onSendList">{{ $trans('share-list') }}</button>
            <button class="secondary-btn" @click="onRecipe">{{ $trans('home-action-1') }}</button>
            <button class="secondary-btn" @click="closeModal">{{ $trans('back') }}</button>
        </div>
    </dialog>
</template>

<script setup>
//TODO: convert btns to loop 
import { watchEffect, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { shareService } from '@/services/share.service.js'
import { useListStore } from '@/stores/list-store'
import { showErrorMsg, showSuccessMsg } from '@/services/event-bus.service';

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
    closeModal()
}

function onShowSummary(query) {
    closeModal()
    router.push({ name: 'list-summary', query: query })
}

const listStore = useListStore()
const selectItems = computed(() => listStore.getSelectedItems)
async function onSendList() {
    closeModal()
    if (!selectItems.value.length) {
        showSuccessMsg('Nothing to share')
        return
    }
    try {
        let idsTosShare = selectItems.value.map(({ _id }) => _id)

        const url = `${import.meta.env.VITE_PROD_URL}?share=true&ids=${idsTosShare}`;
        console.debug(url);

        await navigator.share({ title: 'My shopping list', text: 'Check out my shopping list', url: url })

        showSuccessMsg('List sent successfully ')

    } catch (error) {
        console.log(error);
        showSuccessMsg('Failed to send list')
    }
   
}



function slickOutSide(ev) {
    if (!ev.target.classList.contains('actions-container')) {
        closeModal()
    }
}
function onRecipe() {
   
    closeModal()
    router.push({ name: 'recipe' })


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