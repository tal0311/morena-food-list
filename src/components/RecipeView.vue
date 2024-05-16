<template>
    <section class="recipe-view">
        <h2>Food inspiration</h2>
        <RecipeList v-if="recipes && recipes.length" :recipes="recipes" />
    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
// import { useListStore } from '@/stores/list-store';
import RecipeList from '@/components/RecipeList.vue'
// import { useRoute } from 'vue-router';

// const listStore = useListStore()
const recipeStore = useRecipeStore()
onBeforeMount(() => {
    //    console.log(listStore)

    // const query =useRoute().query
    // console.log(import.meta.url + '?', query);
    // recipeStore.loadMatches()
    // for (const key in query) {
    //     console.log(query[key]);
    // } 
})

const recipes = computed(() => {
    return recipeStore.getMatchRecipes
})



//https://source.unsplash.com/random/800x600
</script>
<style scoped>


</style>
