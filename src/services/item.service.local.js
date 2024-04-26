import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";

import items from "./../data/item.json";
const STORAGE_KEY = "item_DB";

export const itemService = {
  query,
  getById,
  save,
  remove,
  getEmptyItem,
  prepDataForChart,
  // getGroupsLabels,
};
window.itemService = itemService;

async function query(filterBy = {}) {
  let items = await storageService.query(STORAGE_KEY);
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, "i");
    items = items.filter((item) => regex.test(item.txt));
  }

  return items;
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

// async function getGroupsLabels() {
//   const items = await query();
//   return Object.values(items.map((item) => item.group));
// }
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


 

  console.log("data", itemsMap);
  return itemsMap;
}

// TEST DATA
(async () => {
  utilService.saveToStorage(STORAGE_KEY, items);
})();
