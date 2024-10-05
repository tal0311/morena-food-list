
export const adminService = {
    getEmptyUser,
    getEmptyItem,
    getEmptyList
}

// BACKEND: check if all fields are allowed to be empty
function getEmptyUser() {
    return {
       username: "",
       fullname: "",
        email: "",
        password: "",
        goals: [],
        settings: {
          lang: "he",
          notifications: false,
          isVegan: false,
          isVegetarian: false,
          isGlutenFree: false,
          isLactoseFree: false,
          isKosher: false
        },
        level: 0,
        points: 0,
        achievements: [],
        imgUrl: "",
        age: null,
        city: "",
        personalTxt: "",
        labelOrder: [],
        labels: [],
        history: [],
       
        role: "",
        googleID: "",
        exItems: []
      };
      
}

function getEmptyItem() {
    return {
        name: '',
        translation:{
            he: {val: '', isRequired: true},
            en: {val: '', isRequired: true},
            es:{val: '', isRequired: true},
        },
        
        icon: '',
        group: '',
        readMoreURL: '',
        color: '',
        isSelected: false
    }
}

// BACKEND: set default values for list
// BACKEND: set owner

function getEmptyList() {
    return {
        title: "",
        visibility: "public",
        owner: {
            id: "",
            imgUrl: "",
            username: ""
        },
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
}



