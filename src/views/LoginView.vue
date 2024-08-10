<template>
    <section class="main-layout login-view">
        <h1>Login</h1>
        <form class="grid" @submit.prevent="login('credentials', credentials)">
            <input type="email" v-model="credentials.email" placeholder="Email" required>
            <input type="password" v-model="credentials.password" placeholder="Password" required>
            <button type="submit" :class="`primary-btn ${isLoading.credentials? 'loading' :''}` ">
                <MiniLoader v-if="isLoading.credentials" />
                <p v-else>Login</p>
            </button>
        </form>
        <button class="secondary-btn grid" @click="login('guest')">
            <MiniLoader v-if="isLoading.guest" />
            <span v-else class="grid ">
                Continue as guest
                <small>(less features less fun)</small>
            </span>
        </button>
        <div class="sep-container grid grid-dir-col">

            <span class="sep"></span> <span class="or">OR</span> <span class="sep"></span>
        </div>
        <!-- <GoogleLogin :callback="callback" prompt auto-login /> -->
        <GoogleLogin :callback="callback" prompt />
    </section>

</template>

<script setup>
import { ref , watchEffect } from 'vue'
import { decodeCredential } from 'vue3-google-login'
import { useUserStore } from '@/stores/user-store';
import { useRouter } from 'vue-router';
import MiniLoader from '@/components/MiniLoader.vue'
const credentials = ref({
    email: 'tal.amit0311@gmail.com',
    password: '1234'
})

const isLoading = ref({ credentials: false, google: false, guest: false })

watchEffect(() => {
    console.log('isLoading', isLoading.value);

})
const userStore = useUserStore()
const userCredFromGoogle = ref(null)
const router = useRouter()

function callback(response) {
    console.log('response', response);

    if (response.error) {
        console.error('error', response.error)
    } else {
        getCredFromGoogle(response)
    }

}

async function login(type, credential) {
    try {
        console.log(type, credential);
        
        isLoading.value[type] = true
     
        setTimeout(() => {
            isLoading.value[type] = false
        }, 2000);
        // console.log('login with credentials' ,isLoading.value);
        // if (type === 'credentials') {
            
        //     await userStore.login(type, { email: credential.email, password: credential.password })

        // } else {

        //     await userStore.login(type, credential)
        // }
        // router.push('/')

        // await userStore.login(type, credential)
        // router.push('/')
    } catch (error) {
         
        // console.error('error', error)
        // login('guest')

    }
}

const demoUser = {
    "username": "Tal Amit",
    "email": "tal.amit0311@gmail.com",
    "password": "",
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
    "imgUrl": "https://lh3.googleusercontent.com/a/ACg8ocLTQdHl9NRJc9pFi27CqnmkOJTBC6namN9PpUVf88gmpnKr2sFy=s96-c",
    "age": null,
    "city": "",
    "labels": [],
    "history": [],
    "personalTxt": "",
    "role": "admin",
    "googleID": "116549974717956267584",
    "_id": "t0x7G"
}

async function getCredFromGoogle({ credential }) {
    // console.log('credential', credential);
    userCredFromGoogle.value = decodeCredential(credential)

    await login('google', userCredFromGoogle.value)
}


</script>

<style scoped>
.login-view {
    gap: 1.5rem;
    border: 1px solid var(--bClr1);
    padding: 2.5rem 0;
    border-radius: var(--br);

    h1 {
        font-size: 2rem;
        margin: 0;
        /* color: var(--bClr1); */
    }

    .secondary-btn {
        /* margin: 1rem 0; */
        padding: 0.6rem 0;
        width: 100%;
        /* height: 3rem; */
    }

    form {
        gap: 1rem;

        input {
            padding: 0.5rem;
            border: 1px solid var(--bClr1);
            border-radius: var(--br);
            font-size: 1rem;
            color: var(--clr7);

            &:focus {
                outline: 1px solid var(--bClr3);
            }
        }

        .primary-btn {

            &.loading{
                padding: 0.8rem;
            }
            /* padding: 1rem; */
            width: 100%;
        }
    }
}

.sep-container {
    gap: 0.5rem;
    color: var(--clr5);
    width: 100%;
    /* background: aliceblue; */
    grid-template-columns: 1fr auto 1fr;
    align-items: center;

    .or {
        font-size: 1rem;
        /* color: var(--bClr1); */

    }
}

.sep {
    height: 1px;
    width: 100%;
    background-color: var(--clr5);
    font-weight: bold;
}

/* override google styling */


#container {
    background-color: lightblue;

    div[role="button"] {

        height: 42px;
        border: 1px solid #7c94bb;
        border-radius: 8px;
    }

}
</style>