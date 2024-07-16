import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";


import lists from "./../data/list.json";

const STORAGE_KEY = "list_DB";


export const listService = {
  query,
  getEmptyList
};
window.listService = listService;

// loadItems();

async function query(filterBy = {}) {
  const loggedUser = userService.getLoggedInUser();
  let lists = await storageService.query(STORAGE_KEY);
  console.log('lists', lists);
  lists = lists.filter(list => list.owner.id === loggedUser._id)
  return lists;
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

function getEmptyList(title = "New List") {
  return {
    __id: utilService.makeId(),
    title,
    owner: { ...userService.getLoggedInUser(), _id: userService.getLoggedInUser()._id },
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}




// TEST DATA
(() => {
  utilService.saveToStorage(STORAGE_KEY, lists);
})();
