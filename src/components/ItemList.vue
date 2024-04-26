<template>
    <section>
        
        <ItemPreview v-for="item in props.list" :item="item" :key="item._id"
            @selectItem="$emit('selectItem', $event)" />
    </section>
</template>

<script setup>

import ItemPreview from '@/components/ItemPreview.vue';
const props = defineProps({
    list: Array
})



</script>

<style scoped></style>