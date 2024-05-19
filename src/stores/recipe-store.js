import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { recipeService } from "@/services/recipe.service.local";
import { useListStore } from "./list-store";

// TODO : convert error handling to plugin
export const useRecipeStore = defineStore("recipe", () => {
    

    const matchRecipes = ref(null);

    const getMatchRecipes = computed(() => matchRecipes.value);


     function loadMatches() {
        console.log('loadMatches');
        matchRecipes.value=  recipeService.query()
    }

    const recipesList = ref(null);
    const getRecipes = computed(() => recipesList?.value);
    async function loadRecipes(){
        return await recipeService.getRecipes()
    }

    return {
        loadRecipes,
        getRecipes,
        loadMatches,
        getMatchRecipes
    }
})
