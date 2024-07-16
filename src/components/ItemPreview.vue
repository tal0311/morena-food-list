<template>
    <!-- <pre></pre> -->
    <section :class="`item-preview grid ${isSwiped ? 'swiped' : 'disabled'} ${sharedItem && 'shared'} `">
        <input v-if="isSwiped" type="checkbox" :id="item._id" :checked="props.item.isSelected && isSwiped"
            @change="onSelect">
        <div @click="isSwiped = !isSwiped">
            <span>{{ $trans(props.item.name) }}</span>
            <span>{{ props.item.icon }}</span>
        </div>
        <span @click.stop="itemInfo" v-html="$svg('help')"></span>

    </section>
</template>

<script setup>

import { useRoute } from 'vue-router'
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useListStore } from '@/stores/list-store';


const props = defineProps({
    item: Object,
    idx: Number,
    labelName: String
})

const emit = defineEmits(['selectItem', 'shearSelectItem'])

const previewRef = ref(null)
const isSwiped = ref(false)
let elHammer = null

const route = useRoute()
onMounted(() => {


})

onBeforeMount(() => {

    if (route.name === 'list-summary') {
        isSwiped.value = true
    }


})

const listStore = useListStore()
watchEffect(() => {

    if (route.name === 'list') {

        if (listStore?.getCurrList?.items.includes(props.item._id)) {
            // console.log('item is selected' , props.item._id);
            handleSharedIds()

        }
    }



})



function handleSharedIds() {
    // console.debug('handling shared ids');
    isSwiped.value = true
    emit('selectItem', { item: props.item, labelName: props.labelName, isShared: true })


}

function onSelect() {
    emit('selectItem', { item: props.item, labelName: props.labelName })
}



const sharedItem = ref(false)

watchEffect(() => {

    if (route.query.ids && route.query.share) {
        if (route.query.ids.split(',').includes(props.item._id)) {
            sharedItem.value = true
        }
    }

    if (route.name === 'list-summary') {
        // isSwiped.value = true
    }
})

function itemInfo() {
    showSuccessMsg('More info coming soon')
}


</script>

<style scoped>
.item-preview {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    grid-auto-flow: column;
    /* grid-template-columns: 50% 50%; */
    cursor: pointer;
    padding: 0.5rem;
    box-shadow: 0 0 1px 1px lightgray;

    span:last-child {
        justify-self: end;
    }

    &.shared input[type="checkbox"] {
        accent-color: var(--bClr5);
    }
}

.label-container {
    /* font-size: 1.5rem; */
    grid-auto-flow: column;
    grid-template-columns: 20px 50%;
    align-items: center;
    gap: 1rem;
}

input[type="checkbox"] {
    padding: 1rem;
    accent-color: var(--bClr3);
}


.disabled {

    opacity: 0.5;
}
</style>