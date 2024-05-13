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
  loadLabelsFromStorage,
  updateLabel,
  getLabels
};
window.itemService = itemService;

loadItems();

async function query(filterBy = {}) {
  let items = await storageService.query(STORAGE_KEY);
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, "i");
    items = items.filter((item) => regex.test(item.txt));
  }

  return items;
  // return getGroupsByLabels(items);

}


function getGroupsByLabels(list) {
    
  // debugger
  const itemMap= list.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});
  // console.log("acc", itemMap);

  return itemMap;

  //  Object.keys(list.value).map(label=>({name:label, userInput: ''}))
}

function loadLabelsFromStorage() {  } 

function updateLabel(label) {
  label = JSON.parse(JSON.stringify(label.value));
  
  let labels = utilService.loadFromStorage(LABELS_KEY);
  labels= labels.map((l) => l.name === label.name ? {...label , userInput:label.userInput} : l);

  utilService.saveToStorage(LABELS_KEY, labels);
  return labels;

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
  } else {
    // Later, owner is set by the backend
    item.owner = userService.getLoggedInUser();
    savedItem = await storageService.item(STORAGE_KEY, item);
    // savedItem = await httpService.item('item', item)
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

async function loadItems() {
  let items = utilService.loadFromStorage(STORAGE_KEY);
  if (!items || !items.length) {
    try {
      const res = await fetch(import.meta.env.VITE_DATA_URL);
      items = await res.json();

      utilService.saveToStorage(STORAGE_KEY, items);
      console.debug("Loaded and saved items", items);
    } catch (error) {
      console.debug("Failed to load items", error);
    }
  }
}

// TEST DATA
(async () => {
  utilService.saveToStorage(STORAGE_KEY, items);
})();
