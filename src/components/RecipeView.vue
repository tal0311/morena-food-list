<template>
    <section class="recipe-view">
        <h2>Food inspiration</h2>
        <RecipeList v-if="recipes && recipes.length" :recipes="recipes" :is="'match'" />
        <RecipeList v-else="inspiration && inspiration.length" :recipes="inspiration" :is="'inspiration'"
            @addToList="addToList" />

        <footer v-if="listFromRecipes.length>0">
            <RouterLink to="/list" class="icon" >
               <button>Go To List</button>
            </RouterLink>
        </footer>

    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount, watchEffect } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
import { useRoute } from 'vue-router';
import RecipeList from '@/components/RecipeList.vue'
import { recipeService } from '@/services/recipe.service.local';
import { useListStore } from '@/stores/list-store';
// import InspPreview from '@/components/InspPreview.vue'
const recipeStore = useRecipeStore()
const route = useRoute()



const inspiration = ref(null)

onBeforeMount(() => {
    if (route.query.inspiration) {
        loadRecipes()
    }
})

async function loadRecipes() {
    inspiration.value = await recipeService.getRecipes()
    // console.log('inspiration', inspiration.value);
}

const recipes = computed(() => {
    // console.log(recipeStore.getMatchRecipes);
    return recipeStore.getMatchRecipes
})


const listFromRecipes = ref([])
async function addToList(id) {
    // console.log('add to list', id);
    const items = await recipeService.getProductsFromRecipe(id)
    if (items.length) {
        listFromRecipes.value=Array.from( new Set( [...JSON.parse(JSON.stringify(listFromRecipes.value)) ,...items]))
    }


}




watchEffect(() => {
    if (listFromRecipes.value) {
        console.log('listFromRecipes', listFromRecipes.value);
       
    }
})


</script>
<style scoped></style>
