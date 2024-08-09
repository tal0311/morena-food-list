import gUsers from './../data/user.json';
import { storageService } from './async-storage.service.js';
import { httpService } from './http.service';
import { utilService } from './util.service';
import { useUserStore } from '@/stores/user-store';
import { socketService, SOCKET_EVENT_UPDATE_USER } from './socket.service';


setTimeout(() => {
    const userStore = useUserStore();
    socketService.on(SOCKET_EVENT_UPDATE_USER, (user) => {
        _saveLoggedUser(user);
        userStore.loggedUser.value = user;

    });
    // console.log('userService', userService);
}, 0);
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
    query
}

createUsers()
window.userService = userService;


async function query() {
    return await storageService.query(STORAGE_KEY);
}

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
        // console.log('updatedUser', updatedUser);
        _saveLoggedUser(updatedUser);

        return updatedUser;

    }

}


function removeUser(userId) {
    return storageService.remove(STORAGE_KEY, userId);
}


// BACKEND 
async function login(loginType, credentials) {

    const user = await httpService.post('auth/login', credentials)
    console.log('user', user);


    if (user) {
        _saveLoggedUser(user);
        return user;
    }


    // if (loginType === 'guest') {
    //     let guestUser = getGuestUser();
    //     return await save(guestUser)

    // }
    // if (loginType === 'google') {
    //     let user = getEmptyUser();
    //     user.username = credentials.name
    //     user.email = credentials.email
    //     user.imgUrl = credentials.picture
    //     user.googleID = credentials.sub
    //     return await save(user)


    // }
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
        personalTxt: "",
        role: "admin"

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
        "personalTxt": "",
        role: "guest"
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

