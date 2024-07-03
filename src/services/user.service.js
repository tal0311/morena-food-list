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
    getGuestUser,
    // updateUser
}

createUsers()
window.userService = userService;




function getLoggedInUser() {
    let user = utilService.loadFromStorage(LOGGED_USER);
    return user;
}

async function save(user) {
    // const err = new Error();
    // console.trace()

    // user = JSON.parse(JSON.stringify(user))

    const method = (user._id) ? 'put' : 'post';
    const updatedUser = await storageService[method](STORAGE_KEY, user);

    if (updatedUser) {
        console.log('updatedUser', updatedUser);
        _saveLoggedUser(updatedUser);
        return updatedUser;

    }

}


function removeUser(userId) {
    return storageService.remove(STORAGE_KEY, userId);
}



async function login(loginType, credentials) {

    if (loginType === 'guest') {
        let guestUser = getGuestUser();
        return await save(guestUser)

    }
    if (loginType === 'google') {
        let user = getEmptyUser();
        user.username = credentials.name
        user.email = credentials.email
        user.imgUrl = credentials.picture
        user.jwt = credentials.jwt
        return await save(user)


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
    utilService.saveToStorage(LOGGED_USER, user);
    return user;
}

function createUsers() {
    let users = utilService.loadFromStorage(STORAGE_KEY);
    if (!users || !users.length) {
        users = gUsers
        utilService.saveToStorage(STORAGE_KEY, users);
    }

    return users;
}

(async () => {
//    _saveLoggedUser(gUsers[0])
})()

