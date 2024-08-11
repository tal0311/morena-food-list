import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";


import lists from "../data/list.json";
import { httpService } from "./http.service.js";

const STORAGE_KEY = "list_DB";


export const listService = {
  query,
  getEmptyList,
  save,
  getById,
  remove
};
window.listService = listService;


// _createLists()
async function query(filterBy = {}) {
  try {

    

    const lists = await httpService.get('list', filterBy)
    return lists;
  } catch (error) {
    console.error('error', error);

    throw "[Failed to load lists, please try again later] " + error;

  }
}


function getById(listId) {
  // return storageService.get(STORAGE_KEY, itemId);
  return httpService.get(`list/${listId}`)
}

async function remove(listId) {
  // await storageService.remove(STORAGE_KEY, itemId);
  return httpService.delete(`list/${listId}`)
}
async function save(list) {
let savedItem;

  if (list._id) {
    // await storageService.put(STORAGE_KEY, list);
    savedItem = await httpService.put(`list/${list._id}`, list)

  } else {
    // await storageService.post(STORAGE_KEY, list);
    savedItem = await httpService.post('list',list)
  }

}

function getEmptyList(title = "רשימה חדשה") {
  return {
  
    title,
    items: [],
 
  };
}
