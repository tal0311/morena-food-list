<template>
    <!-- you can pass options prop: {arrowType:'ios', scrollType:'smooth', scrollLength:200} -->
    <ScrollContainer>
        <!-- list of items don't wrap them in div -->
        <div v-for="i in 10" :class="`item item-${i}`">{{ i }}</div>
    </ScrollContainer>
</template>

<script setup>
import ScrollContainer from '@/components/ScrollContainer.vue';



</script>