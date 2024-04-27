<template>
    <!-- <pre>{{ props.item }}</pre> -->
    <section ref="previewRef" :class="`item-preview ${isSwiped ? 'swiped' : 'disabled'}`">

        <label :for="item._id" @click.stop="$emit('selectItem', props.item._id)">
            <input type="checkbox" :id="item._id" :checked="item.isSelected" :disabled="!isSwiped">
            <span>{{ $trans(props.item.name) }}</span> |
            <span>{{ props.item.icon }}</span>

        </label>

    </section>
</template>

<script setup>
import Hammer from 'hammerjs';
import {useRouter, useRoute}  from 'vue-router'
import { computed, defineProps, onMounted, ref, watchEffect } from 'vue';

// TODO add text area for notes
const props = defineProps({
    item: Object
})

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
    }
}

const route = useRoute()
watchEffect(() => {
    if (route.name === 'list-summary') {
        isSwiped.value = true
    }
})


</script>

<style scoped>
.swiped {
    margin-inline-start: 2rem;
}

.disabled {
    text-decoration: line-through;
    opacity: 0.5;
}
</style>