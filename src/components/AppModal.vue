<template>
    <dialog @click="slickOutSide" ref="dialogRef" class="blur-bg">
        <div class="actions-container grid">
            <button class="secondary-btn" @click="onPrintList">{{ $trans('print') }}</button>
            <button class="secondary-btn" @click="onShowSummary">{{ $trans('summary') }}</button>
            <button class="secondary-btn" @click="onSendList" disabled>{{ $trans('send-to-moran') }}</button>
            <button class="secondary-btn disabled" @click="onRecipe" disabled>{{ 'Recipes (coming soon)' }}</button>
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
import { showSuccessMsg } from '@/services/event-bus.service';

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

const listStore = useListStore()
const selectItems = computed(() => listStore.getSelectedItems)
function onSendList() {
    closeModal()
    console.log('onSendList', selectItems.value);


    // const csvContent = getAsCSV(JSON.parse(JSON.stringify(selectItems.value)))
    // const blob = new Blob([CSVItems], { type: 'text/csv;charset=utf-8;' });
    // const file = URL.createObjectURL(blob);

    // const link = document.createElement('a');
    // link.href = 'data:text/csv;charset=utf-8,' + csvContent;
    // link.download = 'list.csv';
    // link.click();

    showSuccessMsg('Coming soon... for now take a screenshot and send it to Moran')
    return
    // shareService.shareTo('whatsapp', file, 'list.csv')
    console.log('onSendList');
}

function getAsCSV(items) {
    const [h1, h2, h3, h4, h5] = Object.keys(items[0])
    let csvStr = `${h2},${h3},${h4}`
    items.forEach(({ name, icon, group }) => {
        const csvLine = `\n${name},${icon},${group}`
        csvStr += csvLine
    })

    console.log(csvStr);
    return csvStr
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

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>