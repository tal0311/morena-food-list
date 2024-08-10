<template>
    <div class="actions-container grid">
        <button v-for="btn in btns" class="secondary-btn" @click="btn.action">{{ $trans(btn.name) }}</button>
    </div>

</template>

<script setup>
import { watchEffect, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { eventBus, showSuccessMsg, showErrorMsg } from '@/services/event-bus.service';
// import { useUserStore } from '@/stores/user-store';
import { useListStore } from '@/stores/list-store';
import { listService } from '@/services/list.service.js';
// import { listService } from '@/services/list.service.local.js';

const emit = defineEmits(['resetModal'])
// const userStore = useUserStore()
const listStore = useListStore()
const btns = [
    {
        name: 'summary',
        action: onShowSummary
    },
    {
        name: 'share-list',
        action: onSendList
    },
    {
        name: 'save-history',
        action: saveHistory
    },
]

const router = useRouter()
const route = useRoute()



function onShowSummary() {

    closeModal()

    router.push({ name: 'list-summary', query: { ...route.query } })
}



const selectItems = computed(() => listStore.getCurrList)
async function onSendList() {


    if (!selectItems.value || !selectItems.value.items.length) {
        showSuccessMsg('noItemsToShare')
        return
    }
    try {
        // debugger
        let idsTosShare = selectItems.value.items.join(',')
        const url = `${import.meta.env.VITE_PROD_URL}list?share=true&ids=${idsTosShare}`;

        await navigator.share({ title: 'My shopping list', text: 'Check out my shopping list', url: url })
        showSuccessMsg('itemsShared')

    } catch (error) {
        showErrorMsg('failedToShare')
    }
    finally {
        closeModal()
    }

}



async function saveHistory() {

    if (!selectItems.value || !selectItems.value.items.length) {
        showSuccessMsg('selectToSave')
        return
    }

    if (selectItems.value._id) {
        await listService.save(selectItems.value)
        showSuccessMsg(listSaved)
        return

    }


    const title = prompt('Set a title you\'r new list')
    const listToSave = listService.getEmptyList(title)
    listToSave.items = JSON.parse(JSON.stringify(selectItems.value.items))
    await listService.save(listToSave)
    showSuccessMsg('newList')
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