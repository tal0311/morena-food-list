<template>
    <div class="actions-container grid">
        <button v-for="btn in btns" class="secondary-btn" @click="btn.action">{{ $trans(btn.name) }}</button>
    </div>

</template>

<script setup>
import { watchEffect, ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useListStore } from '@/stores/list-store'
import { eventBus, showSuccessMsg } from '@/services/event-bus.service';
import { useUserStore } from '@/stores/user-store';

const emit = defineEmits(['resetModal'])
const btns = [
    {
        name: 'print',
        action: onPrintList
    },
    {
        name: 'summary',
        action: onShowSummary
    },
    {
        name: 'share-list',
        action: onSendList
    },
    {
        name: 'home-action-1',
        action: onRecipe
    },
    {
        name: 'save-history',
        action: saveHistory
    },
    {
        name: 'back',
        action: closeModal
    }
]

const router = useRouter()

function onPrintList() {

    onShowSummary({ print: true })
    closeModal()
}

function onShowSummary(query) {
    // setTimeout(() => {
    //     console.debug('show summary');
    //     eventBus.emit('toggle-modal', { type: 'ModalSummary', info: query })
    // }, 200);
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


const userStore = useUserStore()
function saveHistory() {
    let idsTosShare = selectItems.value.map(({ _id }) => _id)
    console.debug('save history', idsTosShare);
    const url = `share=true&ids=${idsTosShare}`;
    console.debug(url);

    const history={
        url : url,
        date: new Date().toLocaleDateString()
    }

    userStore.addHistory(history)
    showSuccessMsg('History saved successfully')
    // closeModal()
   
}




function onRecipe() {
    closeModal()
    router.push({ name: 'recipe' })


}


function closeModal() {
    console.debug('close modal');
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
</style>