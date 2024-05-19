<template>
    <section class="recipe-view">
        <h2>Food inspiration</h2>
        <RecipeList v-if="recipes && recipes.length" :recipes="recipes" :is="'match'" />
        <RecipeList v-else="inspiration && inspiration.length" :recipes="inspiration" :is="'inspiration'"
            @addToList="addToList" />

        <footer v-if="listFromRecipes.length" class="blur-bg">

            <button class="primary-btn" @click="goToList">Go To List</button>

        </footer>

    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount, watchEffect } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
import { useRoute, useRouter } from 'vue-router';
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
        listFromRecipes.value = Array.from(new Set(
            [...JSON.parse(JSON.stringify(listFromRecipes.value)), ...items]
        ))
    }


}

const router = useRouter()
function goToList() {
    // console.log('go to list');

    router.push({
        name: 'list', query:
        {
            share: true,
            ids: listFromRecipes.value.map(item => item._id).join(',')
        }
    })
}


</script>
<style scoped>
footer {
    position: fixed;
    bottom: 5rem;
    left: 50%;
    display: grid;
    place-content: center;
    transform: translateX(-50%);
    transition: translate 0.2s;
    width: 100%;

    button {
        padding: 1rem;
    }

}
</style>
