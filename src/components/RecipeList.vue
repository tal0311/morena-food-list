<template>

    <section class="recipe-list grid">
    
        <RecipePreview v-for="recipe in props.recipes" :key="recipe.id" :recipe="recipe" 
        :is="props.is" @addToList="$emit('addToList',$event)"/>

    </section>

</template>


<script setup>
import { ref, onBeforeMount } from 'vue';
import RecipePreview from '@/components/RecipePreview.vue'

const props = defineProps({
    recipes: {
        type: Object,

    },
    is: {
        type: String
    }
})
</script>

<style scoped>
.recipe-list {
    gap: 2rem;
    margin-bottom: 10rem;
}
</style>