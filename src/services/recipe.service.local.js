import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";

import gRecipes from "./../data/recipe.json";

const RECIPE_KEY = "recipe_DB";

export const recipeService = {
  query,
  getById,
  remove,
  save,
  getEmptyRecipe,
  updateLabel,
}

window.recipeService = recipeService;

const selectedItems= [
  {
      "_id": "11",
      "name": "Rice",
      "icon": "🍚",
      "group": "grains",
      "readMoreURL": "https://example.com/rice-info",
      "color": "white",
      "isSelected": true
  },
  {
      "_id": "5",
      "name": "Salmon",
      "icon": "🐟",
      "group": "fish-and-seafood",
      "readMoreURL": "https://example.com/eggs-info",
      "color": "pink",
      "isSelected": true
  },
  {
      "_id": "192",
      "name": "beef-ribs",
      "icon": "🍖",
      "group": "meat-and-poultry",
      "readMoreURL": "",
      "color": "red",
      "isSelected": true
  },
  {
      "_id": "193",
      "name": "osso-buco",
      "icon": "🍖",
      "group": "meat-and-poultry",
      "readMoreURL": "",
      "color": "red",
      "isSelected": true
  },
  {
      "_id": "148",
      "name": "pullets",
      "icon": "🍳",
      "group": "meat-and-poultry",
      "readMoreURL": "",
      "color": "yellow",
      "isSelected": true
  },
  {
      "_id": "19",
      "name": "beef",
      "icon": "🥩",
      "group": "meat-and-poultry",
      "readMoreURL": "https://example.com/beef-info",
      "color": "red",
      "isSelected": true
  },
  {
      "_id": "8",
      "name": "Spinach",
      "icon": "🥬",
      "group": "vegetable",
      "readMoreURL": "https://example.com/spinach-info",
      "color": "green",
      "isSelected": true
  },
  {
      "_id": "196",
      "name": "parsley-root",
      "icon": "🥔",
      "group": "vegetable",
      "readMoreURL": "",
      "color": "white",
      "isSelected": true
  },
  {
      "_id": "195",
      "name": "celery-root",
      "icon": "🥔",
      "group": "vegetable",
      "readMoreURL": "",
      "color": "white",
      "isSelected": true
  },
  {
      "_id": "197",
      "name": "cilantro-root",
      "icon": "🥔",
      "group": "vegetable",
      "readMoreURL": "",
      "color": "white",
      "isSelected": true
  },
  {
      "_id": "189",
      "name": "full-tahini",
      "icon": "🌰",
      "group": "spread",
      "readMoreURL": "",
      "color": "white",
      "isSelected": true
  },
  {
      "_id": "141",
      "name": "tahini",
      "icon": "🌰",
      "group": "spread",
      "readMoreURL": "",
      "color": "white",
      "isSelected": true
  },
  {
      "_id": "199",
      "name": "cocoa",
      "icon": "🍫",
      "group": "backing-products",
      "readMoreURL": "",
      "color": "brown",
      "isSelected": true
  }
]

// loadItems();
// await query();
async function query() {
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
      _id: key,
      ingredients: matchItems[key],
      percentage: +((matchItems[key].length / selectedItems.length) * 100).toFixed(),
      recipe: recipes.find(recipe => recipe._id === key)
      
    };
  });



  

  return matchItems;
}


function getGroupsByLabels(list) {

}



function updateLabel(label) {
  console.log("label", label);

}

function getLabels(list) {
  list = JSON.parse(JSON.stringify(list))
  let labels = utilService.loadFromStorage(LABELS_KEY);
  if (!labels || !labels.length) {
    labels = Object.keys(list).map(label => ({ name: label, userInput: "" }));
    console.log("labels", labels);
    utilService.saveToStorage(LABELS_KEY, labels);
  }
  return labels;

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
