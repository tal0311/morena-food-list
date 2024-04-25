<template>
    <section>
        <ItemPreview v-for="item in props.list" :key="item.id" :item="item" />
    </section>
</template>

<script setup>

import ItemPreview from '@/components/ItemPreview.vue';
const props = defineProps({
  list: Array
})
</script>

<style scoped></style>