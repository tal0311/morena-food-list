import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { showErrorMsg } from "@/services/event-bus.service";
import { reportService } from "@/services/report.service";
import { recipeService } from "@/services/recipe.service.local";

// TODO : convert error handling to plugin
export const useRecipeStore = defineStore("recipe", () => {
  
    const matchRecipes = ref(null);

    const getMatchRecipes = computed(() => matchRecipes.value);

    async function loadMatches() {
        matchRecipes.value= await recipeService.query()
    }

    return {
        loadMatches,
        getMatchRecipes
    }
})
