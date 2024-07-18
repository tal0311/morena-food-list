import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";


import lists from "./../data/list.json";

const STORAGE_KEY = "list_DB";


export const listService = {
  query,
  getEmptyList,
  save,
  getById,
  remove
};
window.listService = listService;


_createLists()
async function query(filterBy = {}) {
  const loggedUser = userService.getLoggedInUser();
  let lists = await storageService.query(STORAGE_KEY);
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
  
  
  if (item._id) {
     await storageService.put(STORAGE_KEY, item);
    // savedItem = await httpService.put(`item/${item._id}`, item)

  }else{
    await storageService.post(STORAGE_KEY, item);
    // savedItem = await httpService.post(`item`, item)
  }
  
}

function getEmptyList(title = "רשימה חדשה") {
  const { _id: id, username, imgUrl } =userService.getLoggedInUser() 
  return {
    
    title,
    owner: { id, username, imgUrl },
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}



function _createLists(title, items) {
  const lists = utilService.loadFromStorage(STORAGE_KEY);
  if(!lists ){

    utilService.saveToStorage(STORAGE_KEY, []);
  }
 
}



// TODO:fix this on deploy 
// TEST DATA
// (() => {
//   utilService.saveToStorage(STORAGE_KEY, lists.map(list => {
//     return {
//       ...list,
//       owner:{
//         ...list.owner,
//         id: userService.getLoggedInUser()._id
//       }
//     }
//   }));
// })();

(() => {
  
})();
