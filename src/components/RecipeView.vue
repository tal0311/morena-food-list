<template>
    <section class="recipe-view">
        <h2>Food inspiration</h2>
        <RecipeList v-if="recipes && recipes.length" :recipes="recipes" />
    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
import RecipeList from '@/components/RecipeList.vue'
const recipeStore = useRecipeStore()


const recipes = computed(() => {
    console.log('recipeStore.getMatchRecipes', recipeStore.getMatchRecipes);
    return recipeStore.getMatchRecipes
})


</script>
<style scoped></style>
