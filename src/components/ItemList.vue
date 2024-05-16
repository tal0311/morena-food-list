<template>
    <section class="item-list">
        <slot></slot>
        <!-- {{ sharedIds }} -->
        <ItemPreview v-for="item, idx in props.list" :item="item" :key="item._id" :sharedIds="props.sharedIds" :labelName="props.labelName"
            @selectItem="$emit('selectItem', $event)" />
    </section>
</template>

<script setup>

import ItemPreview from '@/components/ItemPreview.vue';
const props = defineProps({
    list: Array,
    labelName: String,
    sharedIds: Array,
})



</script>

<style scoped></style>