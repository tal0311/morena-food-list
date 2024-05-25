import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";
import { itemService } from "./item.service.local.js";


import gRecipes from "./../data/recipe.json";

const RECIPE_KEY = "recipe_DB";

export const recipeService = {
  query,
  getById,
  remove,
  save,
  getEmptyRecipe,
  
  getRecipes,
  getProductsFromRecipe
}

window.recipeService = recipeService;



// loadItems();
// await query();
function query() {
  const { selectedItems } = userService.getLoggedInUser();

  let matchItems = {};
  let recipes = gRecipes;

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingr => {
      const regex = new RegExp(ingr, "i");

      selectedItems.forEach(item => {
        if (regex.test(item.name)) {
          if (!matchItems[recipe._id]) {
            matchItems[recipe._id] = [ingr];
          } else {
            matchItems[recipe._id].push(ingr);
          }
        }
      });
    });
  });

  matchItems = Object.keys(matchItems).map(key => {
    return {
      ...recipes.find(recipe => recipe._id === key),
      ingredients: matchItems[key],
      percentage: +((matchItems[key].length / selectedItems.length) * 100).toFixed()

    }
  }).sort((a, b) => b.percentage - a.percentage);

  return matchItems;
}

async function getRecipes() {
  const list = await storageService.query(RECIPE_KEY)
  return list;


}


async function getProductsFromRecipe(recipeId) {
  const recipe = gRecipes.find(recipe => recipe._id === recipeId);

  let items = await itemService.query();

  
  let itemsList= []

  // for (let i = 0; i < recipe.ingredients.length; i++) {
  //   const ingr = recipe.ingredients[i];
  //   const regex = new RegExp(ingr, "i");
  //   if
  //   itemsList = items.filter(item => {
  //     return regex.test(item.name);
  //   });
  // }

  recipe.ingredients.forEach(ingr => {
    const regex = new RegExp(ingr, "i");
     items.forEach(item => {
       if (regex.test(item.name)) {
         itemsList.push(item);
       }
    });
    
  });
return itemsList;
}

function getById(itemId) {
  return storageService.get(RECIPE_KEY, itemId);
  // return httpService.get(`item/${itemId}`)
}

async function remove(itemId) {
  await storageService.remove(RECIPE_KEY, itemId);
  // return httpService.delete(`item/${itemId}`)
}
async function save(item) {
  var savedItem;
  if (item._id) {
    savedItem = await storageService.put(RECIPE_KEY, item);
    // savedItem = await httpService.put(`item/${item._id}`, item)
  } else {
    // Later, owner is set by the backend
    const { selectedItems } = userService.getLoggedInUser();
    savedItem = await storageService.item(RECIPE_KEY, item);
    // savedItem = await httpService.item('item', item)
  }
  return savedItem;
}

function getEmptyRecipe() {
  return {
    _id: "",
    title: "",
    description: "",
    ingredients: [

    ],
    products: "",
    instructions: [],
    image: "",
    level: Easy,
    prepTime: null,
    cookTime: null
  }
}




// TEST DATA
(async () => {
  utilService.saveToStorage(RECIPE_KEY, gRecipes);
})();
