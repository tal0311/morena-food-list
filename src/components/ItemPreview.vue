<template>
    <!-- <pre></pre> -->
    <section :class="`item-preview grid ${isSwiped ? 'swiped' : 'disabled'} ${sharedItem && 'shared'} `">
        <input type="checkbox" :id="item._id" :checked="props.item.isSelected && isSwiped">
        <div @click="handleSwipe">
            <span>{{ $trans(props.item.name) }}</span>
            <span >{{ props.item.icon }}</span>
        </div>
        <span @click.stop="itemInfo" v-html="$svg('help')"></span>

    </section>
</template>

<script setup>

import { useRoute } from 'vue-router'
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import { showSuccessMsg } from '@/services/event-bus.service';


const props = defineProps({
    item: Object,
    idx: Number,
    labelName: String
})

const emit = defineEmits(['selectItem', 'shearSelectItem'])

const previewRef = ref(null)
const isSwiped = ref(false)
let elHammer = null

onMounted(() => {


})

onBeforeMount(() => {
    handleSharedIds()


})


const route = useRoute()

function handleSharedIds() {

    if (props.item.isSelected) {
        isSwiped.value = true
        emit('selectItem', { item: props.item, labelName: props.labelName, isShared: true })

    }
}


function handleSwipe() {

    isSwiped.value = !isSwiped.value
    console.log('swipe', isSwiped.value);
    // debugger

    if (props.item.isSelected) {
        onSelect()
    }

}


function onSelect() {

    if (!isSwiped.value) {
        handleSwipe()
        return
    }

    emit('selectItem', { item: props.item, labelName: props.labelName })
}



const sharedItem = ref(false)

watchEffect(() => {

    if (route.query.ids) {
        if (route.query.ids.split(',').includes(props.item._id)) {
            // console.log('shared item', props.item._id);
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
    transition : padding-inline-start 0.2s;

    span:last-child {
        justify-self: end;
    }

    &.shared input[type="checkbox"] {
        accent-color: var(--bClr5);


    }

    &.swiped {
        padding-inline-start: 2rem;
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