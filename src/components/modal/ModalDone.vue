<template>
    <div class="actions-container grid">
        <button class="secondary-btn" @click="onPrintList">{{ $trans('print') }}</button>
        <button class="secondary-btn" @click="onShowSummary">{{ $trans('summary') }}</button>
        <button class="secondary-btn" @click="onSendList">{{ $trans('share-list') }}</button>
        <button class="secondary-btn" @click="onRecipe">{{ $trans('home-action-1') }}</button>
        <button class="secondary-btn" @click="closeModal">{{ $trans('back') }}</button>
    </div>
</template>

<script setup>
import { watchEffect, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useListStore } from '@/stores/list-store'
import { showSuccessMsg } from '@/services/event-bus.service';

const router = useRouter()

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
    finally {
        closeModal()
    }

}




function onRecipe() {

    closeModal()
    router.push({ name: 'recipe' })


}
const emit = defineEmits(['resetModal'])

function closeModal() {
    console.log('close modal');
    emit('resetModal')

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