import gUsers from './../data/user.json';
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
    getGuestUser


}

createUsers()
window.userService = userService;




function getLoggedInUser() {
    let user = utilService.loadFromStorage(LOGGED_USER);
    console.debug('user', user);
    return user;
}



async function save(user) {

    const method = (user._id) ? 'put' : 'post';
    const updatedUser = await storageService[method](STORAGE_KEY, user);
    if (updatedUser) {
        return _saveLoggedUser(updatedUser);

    }

}


function removeUser(userId) {
    return storageService.remove(STORAGE_KEY, userId);
}



function login(loginType, credentials) {
    debugger
    if (loginType === 'guest') {
        const guestUser = getGuestUser();
        _saveLoggedUser(guestUser);
        return guestUser;
    }
    if (loginType === 'google') {

        // console.log('credentials',credentials);
        const user = getEmptyUser();
        user.username = credentials.name;
        user.email = credentials.email;
        user.imgUrl = credentials.picture;
        user.jwt = credentials.jwt;
        // save(user);

        return _saveLoggedUser(user);

    }
    const user = storageService.query(STORAGE_KEY, credentials);
    // const user = storageService.query(STORAGE_KEY);

    _saveLoggedUser(user);
    return user;



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

        username: "",
        email: "",
        password: "",
        goals: [],
        settings: {
            "lang": "he",
            "notifications": true,
            "isVegan": false,
            "isVegetarian": false,
            "isGlutenFree": false,
            "isLactoseFree": false,
            "isKosher": false
        },
        level: 1,
        points: 0,
        achievements: [],
        selectedItems: [],
        imgUrl: "",
        age: null,
        city: "",
        labels: [],
        history: [],
        personalTxt: ""
    }
}

function getGuestUser() {
    return {

        "username": "Guest",
        "email": "user1@example.com",
        // "password": "password1",
        "goals": [],
        "settings": {
            "lang": "he",
            "notifications": true,
            "isVegan": false,
            "isVegetarian": false,
            "isGlutenFree": false,
            "isLactoseFree": false,
            "isKosher": false
        },
        "level": 1,
        "points": 0,
        "achievements": [],
        "selectedItems": [],
        "imgUrl": "https://ui-avatars.com/api/?name=Guest%user&rounded=true",
        "age": null,
        "city": "Israel", //get location from useragent
        "labels": [],
        "history": [],
        "personalTxt": ""
    }
}


function _saveLoggedUser(user) {
    return utilService.saveToStorage(LOGGED_USER, user);
}

function createUsers() {
    let users = utilService.loadFromStorage(STORAGE_KEY);
    if (!users || !users.length) {
        users = gUsers
        utilService.saveToStorage(STORAGE_KEY, users);
    }

    return users;
}

