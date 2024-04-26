<template>
    <!-- <pre>{{ props.item }}</pre> -->
    <section ref="previewRef" :class="`item-preview ${isSwiped ? 'swiped' : 'disabled'}`">

        <label :for="item._id" @click.stop="$emit('selectItem', props.item._id)">
            <input type="checkbox" :id="item._id" :checked="item.isSelected" :disabled="!isSwiped">
            <span>{{ props.item.name }}</span> |
            <span>{{ props.item.icon }}</span>

        </label>

    </section>
</template>

<script setup>
import Hammer from 'hammerjs';
import { computed, defineProps, onMounted, ref } from 'vue';

const props = defineProps({
    item: Object
})

const previewRef = ref(null)
const isSwiped = ref(false)
let elHammer = null

onMounted(() => {

    elHammer = new Hammer(previewRef.value)
    elHammer.on('swipe', handleSwipe)
    // console.log('previewRef',previewRef.value);

    // console.log(elHammer);
})


function handleSwipe(ev) {
    if (ev.type === 'swipe') {
        isSwiped.value = !isSwiped.value
    }
}









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