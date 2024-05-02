<template>
    <!-- <pre>{{ props.item }}</pre> -->
    <section ref="previewRef" :class="`item-preview idx- ${isSwiped ? 'swiped' : 'disabled'}`">

        <label class="label-container grid"  @click.stop="onSelect">
            <input type="checkbox"  :checked="item.isSelected && isSwiped" :disabled="!isSwiped">
            <span>{{ $trans(props.item.name) }}</span>
            <span>{{ props.item.icon }}</span>

        </label>

    </section>
</template>

<script setup>
import Hammer from 'hammerjs';
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, ref, watchEffect } from 'vue';
import { showSuccessMsg } from '@/services/event-bus.service';

// TODO add text area for product 
const props = defineProps({
    item: Object,
    idx: Number,
    isTourActive: {
        default: true

    }
})

const emit = defineEmits(['selectItem'])

const previewRef = ref(null)
const isSwiped = ref(false)
let elHammer = null

onMounted(() => {
    elHammer = new Hammer(previewRef.value)
    elHammer.on('swipe', handleSwipe)
})


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
    emit('selectItem', props.item._id)
}

const isFirstItem = computed(() => {
    return props.idx.pIdx===0 && props.idx.idx === 0 ?'first':''
})

const route = useRoute()
watchEffect(() => {
    if (route.name === 'list-summary') {
        isSwiped.value = true
    }
})




</script>

<style scoped>
.label-container {
    font-size: 1.5rem;
    grid-auto-flow: column;
    grid-template-columns: 20px 50% 1fr;
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