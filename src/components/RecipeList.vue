<template>

    <section class="recipe-list grid">
    <!-- <pre> {{ recipes.map(recipe => recipe) }}</pre> -->
        <RecipePreview v-for="recipe in props.recipes" :recipe="recipe" :key="recipe._id"  />

    </section>

</template>


<script setup>
import { ref, onBeforeMount } from 'vue';
import RecipePreview from '@/components/RecipePreview.vue'

const props = defineProps({
    recipes: {
        type: Object,

    },
  })
</script>

<style scoped>
.recipe-list {
    gap: 2rem;
    margin-bottom: 10rem;
}
</style>