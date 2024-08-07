
const gTrans = await fetch('https://cdn.jsdelivr.net/gh/tal0311/food-list-data@main/items-trans.json').then(res => res.json())

function doTrans(key, currLang = 'he') {
  // console.debug("key", key);
  // return
  var translation = gTrans[key][currLang];
  if (!translation) return key;
  return translation;
}

function getTransItem(key) {
  return gTrans[key.toLowerCase()]
}

export const i18Service = {
  doTrans,
  getTransItem
};
