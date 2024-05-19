<template>

    <section class="recipe-list grid">
        {{ props.recipes }}
        <RecipePreview v-for="recipe in props.recipes" :key="recipe.id" :recipe="recipe" />
    </section>

</template>


<script setup>
import { ref, onBeforeMount } from 'vue';
import RecipePreview from '@/components/RecipePreview.vue'

const props = defineProps({
    recipes: {
        type: Object,

    }
})
</script>

<style scoped>
.recipe-list {
    gap: 2rem;
    margin-bottom: 10rem;
}
</style>