<template>
    <section class="recipe-view">
        <h2>Food inspiration</h2>
        <RecipeList v-if="recipes && recipes.length" :recipes="recipes" />
        
<!-- 
        <section v-else>
            <section v-if="inspiration" v-for="recipe in inspiration">
                <InspPreview :recipe="recipe" />
            </section>
        </section> -->

    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
import { useRoute } from 'vue-router';
import RecipeList from '@/components/RecipeList.vue'
import { recipeService } from '@/services/recipe.service.local';
// import InspPreview from '@/components/InspPreview.vue'
const recipeStore = useRecipeStore()
const route = useRoute()



const inspiration = ref(null)

onBeforeMount(() => {
    // if (route.query.inspiration) {
    //     loadRecipes()
    // }
})

async function loadRecipes() {
    inspiration.value = await recipeService.getRecipes()
    console.log('inspiration', inspiration.value);
}

const recipes = computed(() => {
    // console.log(recipeStore.getMatchRecipes);
    return recipeStore.getMatchRecipes
})


</script>
<style scoped></style>
