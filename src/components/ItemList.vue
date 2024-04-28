<template>
    <section>
        <slot></slot>
        <ItemPreview v-for="item, idx in props.list" :item="item" :key="item._id" :isTourActive="props.isTourActive"
            @selectItem="$emit('selectItem', $event)" />
    </section>
</template>

<script setup>

import ItemPreview from '@/components/ItemPreview.vue';
const props = defineProps({
    list: Array,
    idx: Number,
    isTourActive: {
        default: true
    }
})



</script>

<style scoped></style>