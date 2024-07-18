<template>
    <section class="recipe-view">
        <!-- {{ recipes }} -->
        <h2>{{ $trans('food-inspiration') }}</h2>
        <section class="filter-container grid grid-dir-col">

            <button v-for="btn in filterBtns" :key="btn" :class="[activeLabel === btn&& 'active', 'grid', 'secondary-btn']" 
                @click="setFilterByGroup(btn)">
                <span>{{ getIconByBtn(btn) }}</span>
                <small>{{ countByGroup[btn]}}</small>
            </button>



        </section>
        <RecipeList v-if="recipes" :recipes="recipes" :is="'match'" />

    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount, watchEffect } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
import { useRoute, useRouter } from 'vue-router';
import RecipeList from '@/components/RecipeList.vue'
import ScrollContainer from '@/components/ScrollContainer.vue';


const recipeStore = useRecipeStore()

const filterByGroup = ref(null)
const recipes = computed(() => {
    if (!filterByGroup.value || filterByGroup.value === 'all') return recipeStore.getRecipes

    return recipeStore.getRecipes.filter(recipe => recipe.group === filterByGroup.value)
})
const filterBtns = ref(null)
const countByGroup = ref(null)
const isFirstTime = ref(true)
const activeLabel = ref(null)

watchEffect(() => {
    if (recipes.value && isFirstTime.value) {
        isFirstTime.value = false
        filterBtns.value = ['all', ...Array.from(new Set(recipes.value.map(recipe => recipe.group && recipe.group)))]

        countByGroup.value = recipes.value.reduce((acc, recipe) => {
            acc['all'] =recipes.value.length
            acc[recipe.group] = acc[recipe.group] + 1 || 1
            return acc
        }, {})
    }

})

function setFilterByGroup(label) {
    activeLabel.value = label
    filterByGroup.value = label

}

function getIconByBtn(btn) {
    const opts = {
        'all': 'All',
        'fish': ' 🐟',
        'meat': '🍖',
        'salad': '🥗',
        'dessert': '🍰',
        'other': '🍲',
        'side-dish': '🍚',
        'soup': '🍲',
        'eggs': '🍳',
        'poultry': '🍗',


    }

    return opts[btn] || btn
}


onBeforeMount(() => {

    loadRecipes()

})


function loadRecipes() {
    recipeStore.loadRecipes()

}






</script>
<style scoped>
.recipe-view {
    display: grid;
    gap: 2rem;

    h2 {
        margin-block-end: 0;
    }

    .filter-container {
      
        padding: 0.2rem;
        gap: 1rem;
        overflow: auto;

        button {
            height: 3rem;
            width: 3rem;
            place-content: center;
            /* gap: 0.5rem; */


            &.active {
                opacity: 0.5;
            }



        }
    }
}
</style>
