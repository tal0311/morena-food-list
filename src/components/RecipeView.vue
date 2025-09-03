<template>
    <section class="recipe-view">
        <!-- {{ recipes }} -->
        <h2>{{ $trans('food-inspiration') }} <span class="group-indicator">{{ $trans(filterByGroup) }}</span></h2>
        <section class="filter-container grid grid-dir-col">
            <button class="filter-btn" v-for="btn in filterBtns" :key="btn"
                :class="[activeLabel === btn && 'active', 'grid', 'secondary-btn']" @click="setFilterByGroup(btn)">
                <span>{{ getIconByBtn(btn) }}</span>
                <small>{{ countByGroup[btn] }}</small>
                <small class="filter-icon-title"> {{ btn }}</small>
            </button>
        </section>
        <RecipeList v-if="recipes" :recipes="recipes" :is="'match'" />
    </section>
</template>

<script setup>
import { ref, computed, onBeforeMount, watchEffect } from 'vue';
import { useRecipeStore } from '@/stores/recipe-store';
import RecipeList from '@/components/RecipeList.vue'




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
// this did not work as expected with socket.io
    if (recipes.value && isFirstTime.value) {
        isFirstTime.value = false
        filterBtns.value = ['all', ...Array.from(new Set(recipes.value.map(recipe => recipe.group && recipe.group)))]

        countByGroup.value = recipes.value.reduce((acc, recipe) => {
            acc['all'] = recipes.value.length
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
        'laguns': '🫘',
        'vegan': '🌱',
    }

    return opts[btn] || btn
}

onBeforeMount(() => {
    loadRecipes()
})


async function loadRecipes() {
    try {
    await recipeStore.loadRecipes()
    // recipeStore.loadRecipes()
    } catch (error) {
        console.error('error', error)
    }finally {
        
    }
}





</script>
<style scoped>
.recipe-view {
    display: grid;
    gap: 2rem;
    max-width: 570px;

    h2 {
        margin-block-end: 0;
    }

    .filter-container {

        &::-webkit-scrollbar {
            display: none;
        }

        padding: 0.2rem;
        gap: 1rem;
        overflow: auto;

        button {
            height: 3rem;
            width: 3rem;
            place-content: center;
          


            &.active {
                opacity: 0.5;
            }



        }
    }


    .filter-icon-title {
        display: none;
    }

    .group-indicator {
        color: var(--bClr3);
    }

}
</style>
