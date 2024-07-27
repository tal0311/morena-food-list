<template>
    <section class="item-list">
        <slot></slot>
    
        <ItemPreview v-for="item, idx in props.list" :item="item" :key="item._id" :labelName="props.labelName"
            @selectItem="$emit('selectItem', $event)" />
    </section>
</template>

<script setup>

import ItemPreview from '@/components/ItemPreview.vue';
const props = defineProps({
    list: Array,
    labelName: String,
    
})

</script>

<style scoped></style>