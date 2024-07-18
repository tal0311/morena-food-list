import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";
// import { httpService } from './http.service.js'
import { userService } from "./user.service.js";

import gRecipes from "./../data/recipe.json";

const RECIPE_KEY = "recipe_DB";

const DEFAULT_IMG=  "https://www.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781"

export const recipeService = {
  query,

}

window.recipeService = recipeService;



// loadItems();
// await query();
async function query(filterBy={group: 'fish'}) {
  const recipes = await storageService.query(RECIPE_KEY);

  const { settings } = userService.getLoggedInUser();
  console.log('settings', settings.lang);

  return recipes.map(recipe => {
    const {_id, group, imgUrl} = recipe;
 
    return {
      _id,
      group,
      imgUrl: imgUrl || DEFAULT_IMG,
      ... recipe[settings.lang],
    };
  
  });
}


// TEST DATA
(async () => {
  utilService.saveToStorage(RECIPE_KEY, gRecipes);
})();
