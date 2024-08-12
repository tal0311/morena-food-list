<template>
    <section class="item-list">
        <slot></slot>

        <ItemPreview v-for="item, idx in props.list" :display="props.display" :item="item" :key="item._id" :labelName="props.labelName"
            @selectItem="$emit('selectItem', $event)" />
    </section>
</template>

<script setup>

import ItemPreview from '@/components/ItemPreview.vue';

const props = defineProps({
    list: Array,
    labelName: String,
    display: {
        type: String,
        default: 'list-items'
    }

})

</script>

<style scoped></style>