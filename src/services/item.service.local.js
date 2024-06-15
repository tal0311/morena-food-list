import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";


import items from "./../data/item.json";
const STORAGE_KEY = "item_DB";
const LABELS_KEY = "labels_DB";

export const itemService = {
  query,
  getById,
  save,
  remove,
  getEmptyItem,
  prepDataForChart,
  getGroupsByLabels,

  updateLabel,
  getLabels
};
window.itemService = itemService;

// loadItems();

async function query(filterBy = {}) {
  const loggedUser = userService.getLoggedInUser();

  let items = await storageService.query(STORAGE_KEY);
  const { isVegetarian, isVegan, isLactoseFree, isKosher, isGlutenFree } = loggedUser.settings;
  if (isVegetarian) {
    const vegItems = ['meat-and-poultry', 'fish', 'seafood']
    items = items.filter((item) => !vegItems.includes(item.group));
  }
  if (isVegan) {
    const veganItems = ['dairy', 'meat-and-poultry', 'fish', 'seafood']
    items = items.filter((item) => !veganItems.includes(item.group));
  }

  if (isLactoseFree) {
    items = items.filter((item) => item.group !== 'dairy');
  }
  if (isKosher) {
    items = items.filter((item) => item.group !== 'seafood');
  }

  if (isGlutenFree) {
    items = items.filter((item) => item.group !== 'bread');
  }

  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, "i");
    items = items.filter((item) => regex.test(item.txt));
  }

  return items;
  // return getGroupsByLabels(items);

}


function getGroupsByLabels(list) {

  const itemMap = list.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  return itemMap;

}



async function updateLabel(label) {
  label = JSON.parse(JSON.stringify(label.value));

  const user = userService.getLoggedInUser();

  user.labels = user.labels.map((l) => l.name === label.name ? { ...label, userInput: label.userInput } : l);

  
   userService.save(user);
  return user.labels
  
}


async function getLabels(list , user) {
  user= JSON.parse(JSON.stringify(user))
  list = JSON.parse(JSON.stringify(list))
  user.labels = Object.keys(list).map(label => ({ name: label, userInput: "" }));
  await userService.save(user);
  return user.labels;
}


function getById(itemId) {
  return storageService.get(STORAGE_KEY, itemId);
  // return httpService.get(`item/${itemId}`)
}

async function remove(itemId) {
  await storageService.remove(STORAGE_KEY, itemId);
  // return httpService.delete(`item/${itemId}`)
}
async function save(item) {
  var savedItem;
  if (item._id) {
    savedItem = await storageService.put(STORAGE_KEY, item);
    // savedItem = await httpService.put(`item/${item._id}`, item)

  }
  return savedItem;
}

function getEmptyItem(name) {
  return {
    id: "",
    name,
    icon: "",
    group: "",
    readMoreURL: "https://example.com/rice-info",
    color: "",
    isSelected: false,
  };
}

function prepDataForChart(list) {
  const itemsMap = {};
  list.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, itemsMap);

  for (const group in itemsMap) {
    itemsMap[group] = itemsMap[group].length;
  }
  return itemsMap;
}

// async function loadItems() {
//   let items = utilService.loadFromStorage(STORAGE_KEY);
//   if (!items || !items.length) {
//     try {
//       const res = await fetch(import.meta.env.VITE_DATA_URL);
//       items = await res.json();

//       utilService.saveToStorage(STORAGE_KEY, items);
//       console.debug("Loaded and saved items", items);
//     } catch (error) {
//       console.debug("Failed to load items", error);
//     }
//   }
// }

// TEST DATA
(() => {
  utilService.saveToStorage(STORAGE_KEY, items);
})();
