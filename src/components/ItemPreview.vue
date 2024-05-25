<template>
    <!-- <pre>{{ props.item }}</pre> -->
    <section ref="previewRef" :class="`item-preview grid idx- ${isSwiped ? 'swiped' : 'disabled'}`">

        <label class="label-container grid" :for="item._id">
            <input type="checkbox" :id="item._id" :checked="item.isSelected && isSwiped" :disabled="!isSwiped"
                @click.stop="onSelect">
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
    sharedIds: Array,
    labelName: String

})

const emit = defineEmits(['selectItem'])

const previewRef = ref(null)
const isSwiped = ref(false)
let elHammer = null

onMounted(() => {
    elHammer = new Hammer(previewRef.value)
    elHammer.on('swipe', handleSwipe)

})

onBeforeMount(() => {
    handleSharedIds()

})

function handleSharedIds() {

    if (props.sharedIds && props.sharedIds.includes(props.item._id)) {

        isSwiped.value = true
        onSelect()
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



const route = useRoute()
watchEffect(() => {
    if (route.name === 'list-summary') {
        isSwiped.value = true
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