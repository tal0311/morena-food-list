import users from './../data/user.json';
import { storageService } from './async-storage.service.js';
import { utilService } from './util.service';
const STORAGE_KEY = 'user_DB';
const LOGGED_USER = 'loggedUser';

export const userService = {

    save,
    getEmptyUser,
    removeUser,
    login,
    getLoggedInUser,
    signup,


}
window.userService = userService;




async function getLoggedInUser() {
    let user = await storageService.query(LOGGED_USER);
    return user;
}



function save(user) {

    const method = (user._id) ? 'put' : 'post';
    return storageService[method](STORAGE_KEY, user);

}


function removeUser(userId) {
    return storageService.remove(STORAGE_KEY, userId);
}



function login(credentials) {
    const user = storageService.query(STORAGE_KEY);
    if (user.email === credentials.email && user.password === credentials.password) {
        _saveLoggedUser(user);
        return user;

    } else {
        throw new Error('Invalid credentials');
    }
}

function signup(credentials) {
    const user = storageService.query(STORAGE_KEY);
    if (user.email === credentials.email) {
        throw new Error('Email already exists');
    } else {
        storageService.post(STORAGE_KEY, credentials);
        _saveLoggedUser(credentials);
        return credentials;
    }
}

function getEmptyUser() {
    return {
        id_: utilService.makeId(),
        name,
        age,
        city,
        labels: [],
        imgUrl: "@/assets/images/default-user.png",
        password: "1234"
    }
}




function _saveLoggedUser(user) {
   return utilService.saveToStorage(LOGGED_USER, user);
}

(() => {

    _saveLoggedUser(users[0]);
    // users[0]

})()