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

// createUsers()

window.userService = userService;


async function query() {
    return await httpService.get('user');
}

function getLoggedInUser() {

    return _loadUserFromStorage();
    // let user = utilService.loadFromStorage(LOGGED_USER);
    // return user;
}

async function save(user) {

    let updatedUser = null
    if (user._id) {
        updatedUser = await httpService.put('user/' + user._id, user)
    }
    else {
        updatedUser = await httpService.post('user', user)
    }

    if (updatedUser) {
        _saveLoggedUser(updatedUser);
        return updatedUser;
    }

}

function removeUser(userId) {
    return storageService.remove(STORAGE_KEY, userId);
}

// BACKEND 
async function login(loginType, credentials) {
    let user = null
    switch (loginType) {
        case 'guest':
            user = await loginAsGuest();
            break
        case 'google':
            user = await loginWithGoogle(credentials);
            break
        case 'credentials':
            user = await loginWithCredentials(credentials);
            break
    }

    if (user) {
        _saveLoggedUser(user);
        return user;
    }
}

async function loginWithCredentials(credentials) {
    return await httpService.post('auth/login/credentials', credentials)
}

async function loginWithGoogle(credentials) {

    const userCredentials = {
        ...getEmptyUser(),
        googleID: credentials.sub,
        username: credentials.name,
        email: credentials.email,
        imgUrl: credentials.picture
    }

    return await httpService.post('auth/login/google', userCredentials)
}

async function loginAsGuest() {
     return await httpService.post('auth/signup/guest')
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
        role: "user"

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
        role: "guest",
        createdAt: Date.now(),
    }
}

function _loadUserFromStorage() {
    const loggedUser = JSON.parse(localStorage.getItem('rememberMe'))
        ? JSON.parse(localStorage.getItem(LOGGED_USER))
        : JSON.parse(sessionStorage.getItem(LOGGED_USER))

    return loggedUser
    // return utilService.loadFromStorage(LOGGED_USER);
}

function _saveLoggedUser(user) {
    
    JSON.parse(localStorage.getItem('rememberMe'))
        ? localStorage.setItem(LOGGED_USER, JSON.stringify(user))
        : sessionStorage.setItem(LOGGED_USER, JSON.stringify(user))


    // utilService.saveToStorage(LOGGED_USER, user);
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



