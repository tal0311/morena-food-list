import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";
// import { httpService } from './http.service.js'
import { userService } from "./user.service.js";

import gRecipes from "./../data/recipe.json";
import { httpService } from "./http.service.js";

const RECIPE_KEY = "recipe_DB";

const DEFAULT_IMG=  "https://www.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781"

export const recipeService = {
  query,
  save

}

window.recipeService = recipeService;



// loadItems();
// await query();
async function query(filterBy = {}) {
 
  const recipes = await httpService.get('recipe', filterBy);
  // console.log('recipes:', recipes);
  
   return recipes;

}

function save(recipe){
  console.log(recipe);

  return
  if(recipe._id){
   return httpService.put('recipe/'+recipe._id, recipe)
  }else{
    httpService.post('recipe',recipe)
  }
}


// TEST DATA
// (async () => {
  // utilService.saveToStorage(RECIPE_KEY, gRecipes);
// })();
