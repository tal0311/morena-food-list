<template>
    <!-- <pre>{{ props.item }}</pre> -->
    <section ref="previewRef"
        :class="`item-preview grid ${isSwiped ? 'swiped' : 'disabled'} ${sharedItem && 'shared'} `">

        <label class="label-container grid" :for="props.item._id">
            <input type="checkbox" :id="props.item._id" :checked="props.item.isSelected && isSwiped"
                :disabled="!isSwiped" @click.stop="onSelect">
            <span>{{ $trans(props.item.name) }}</span>

        </label>
        <span @contextmenu.prevent="itemInfo">{{ props.item.icon }}</span>
        <!-- <span @click.stop="itemInfo" v-html="$svg('help')"></span> -->

    </section>
</template>

<script setup>
import Hammer from 'hammerjs';
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
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

const route = useRoute()
onMounted(() => {
    if (route.name === 'list') {
        // isSwiped.value = true
        elHammer = new Hammer(previewRef.value)
        elHammer.on('swipe', handleSwipe)
    }

})

onBeforeMount(() => {
    if (route.name === 'list' && (route.query.share || route.query.history)) {
        handleSharedIds()
        // isSwiped.value = true

    }
    if (route.name === 'list-summary') {
        isSwiped.value = true
    }


})



function handleSharedIds() {
    console.debug('handling shared ids');

    if (props.item.isSelected) {
        isSwiped.value = true
        emit('selectItem', { item: props.item, labelName: props.labelName, isShared: true })

    }
}


function handleSwipe(ev) {
    if (ev.type === 'swipe') {
        isSwiped.value = !isSwiped.value
        if (props.item.isSelected) {
            onSelect()
        }
    }
}


function onSelect() {

    if (!isSwiped.value) {
        showSuccessMsg('Swipe item and click on the checkbox to select it')
        return
    }
    emit('selectItem', { item: props.item, labelName: props.labelName })
}



const sharedItem = ref(false)

watchEffect(() => {

    if (route.query.ids&&route.query.share) {
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
    font-size: 1.5rem;
    grid-auto-flow: column;
    grid-template-columns: 50% 50%;
    cursor: pointer;

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

input {
    width: 20px;
    height: 20px;
    /* margin-inline-start: 1rem; */
}

.swiped {
    margin-inline-start: 2rem;
}

.disabled {

    opacity: 0.5;
}
</style>