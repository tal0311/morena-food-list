import { storageService } from "./async-storage.service.js";
// import { httpService } from './http.service.js'
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";

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
  setLabels
};
window.itemService = itemService;

// loadItems();

async function query(filterBy = {}) {
  // debugger
  // console.log(filterBy);
  const loggedUser = userService.getLoggedInUser();
  // console.log('loggedUser', loggedUser);

  let items = await fetch(import.meta.env.VITE_DATA_URL)
    .then(response => response.json())

  // filtering by text as needed


  if (filterBy.labels) {

    const itemsByLabels = getGroupsByLabels(items)
    await setLabels(itemsByLabels);
    // console.log(itemsByLabels);
    return itemsByLabels

  }


  // filter labels by user settings

  return items;

  // if (isVegetarian) {
  //   const vegItems = ['meat-and-poultry', 'fish', 'seafood']
  //   items = items.filter((item) => !vegItems.includes(item.group));
  // }
  // if (isVegan) {
  //   const veganItems = ['dairy', 'meat-and-poultry', 'fish', 'seafood']
  //   items = items.filter((item) => !veganItems.includes(item.group));
  // }

  // if (isLactoseFree) {
  //   items = items.filter((item) => item.group !== 'dairy');
  // }
  // if (isKosher) {
  //   items = items.filter((item) => item.group !== 'seafood');
  // }

  // if (isGlutenFree) {
  //   items = items.filter((item) => item.group !== 'bread');
  // }

  // if (filterBy.txt) {
  //   const regex = new RegExp(filterBy.txt, "i");
  //   items = items.filter((item) => regex.test(item.txt));
  // }

  // return items;

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
  // label = JSON.parse(JSON.stringify(label));

  const user = userService.getLoggedInUser();

  user.labels = user.labels.map((l) => l.name === label.name ? { ...label, userInput: label.userInput } : l);


  userService.save(user);
  //  console.log('user', user.labels);
  return user.labels

}

// Move to backend
async function setLabels(list) {

  const user = userService.getLoggedInUser();

  user.labels = Object.keys(list).map(label => ({ name: label, userInput: "" }));
  await userService.save(user);

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
