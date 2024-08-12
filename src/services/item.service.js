import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";
import { httpService } from "./http.service.js";

const STORAGE_KEY = "item_DB";
const LABELS_KEY = "labels_DB";

export const itemService = {
  query,
  getById,
  save,
  remove,
  getEmptyItem,
  prepDataForChart,
  updateLabel,
  setLabels
};
window.itemService = itemService;

async function query(filterBy = {}) {
  try {

    const items = await httpService.get('item', filterBy)
    return items;
  } catch (error) {
    console.error('error', error);

    throw "[Failed to load items, please try again later] " + error;
  }
}


// BACKEND move to backend
async function updateLabel(label) {
  // label = JSON.parse(JSON.stringify(label));

  const user = userService.getLoggedInUser();

  user.labels = user.labels.map((l) => l.name === label.name ? { ...label, userInput: label.userInput } : l);
  userService.save(user);
  return user.labels

}

// Move to backend
async function setLabels(list) {

  const user = userService.getLoggedInUser();
  user.labels = !user.labels || user.labels.length !== Object.keys(list).length ? Object.keys(list).map(label => ({ name: label, userInput: "" })) : user.labels;
  user.labels = Object.keys(list).map(label => ({ name: label, userInput: "" }));
  user.labelOrder = !user.labelOrder || user.labelOrder.length != user.labels.length ? user.labels.map(label => label.name) : user.labelOrder;

  await userService.save(user);

}


async function getById(itemId) {
  console.log('item.service.js getById itemId:', itemId);
  
  // return storageService.get(STORAGE_KEY, itemId);
   return await httpService.get(`item/${itemId}`)
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

  list = JSON.parse(JSON.stringify(list));

  // console.log(list.items);
  const itemsMap = list.reduce((acc, curr) => {


    if (!acc[curr.group]) {
      acc[curr.group] = []
    }
    acc[curr.group].push(curr)


    return acc
  }, {})

  for (const group in itemsMap) {
    itemsMap[group] = itemsMap[group].length;
  }
  console.log(itemsMap);
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
// (() => {
//   utilService.saveToStorage(STORAGE_KEY, items);
// })();
