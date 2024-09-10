<template>
    <section class="main-layout login-view">
        <h1>Login</h1>
        <form class="grid" @submit.prevent="login('credentials', credentials)">
            <input type="email" v-model="credentials.email" placeholder="Email" required>
            <input type="password" v-model="credentials.password" placeholder="Password" required>
            <button type="submit" :class="`primary-btn ${isLoading.credentials ? 'loading' : ''}`">
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
        <label for="" class="grid grid-dir-col">
            Remember me
            <input @change="toggleRememberMe" type="checkbox">
        </label>
        <div class="sep-container grid grid-dir-col">

            <span class="sep"></span> <span class="or">OR</span> <span class="sep"></span>
        </div>
        <!-- <GoogleLogin :callback="callback" prompt auto-login /> -->
        <button class="google-login grid">
            <MiniLoader v-if="isLoading.google"/>
            <GoogleLogin v-else :callback="callback" prompt />
        </button>
    </section>

</template>

<script setup>
import { ref } from 'vue'
import { decodeCredential } from 'vue3-google-login'
import { useUserStore } from '@/stores/user-store';
import { useRouter } from 'vue-router';
import MiniLoader from '@/components/MiniLoader.vue'
import { showErrorMsg ,showSuccessMsg } from '@/services/event-bus.service';

const credentials = ref({
    email: '',
    password: ''
})


const rememberMe = ref(false)

function toggleRememberMe() {
    rememberMe.value = !rememberMe.value
    localStorage.setItem('rememberMe', rememberMe.value)
}

const isLoading = ref({ credentials: false, google: false, guest: false })

const userStore = useUserStore()
const userCredFromGoogle = ref(null)
const router = useRouter()

function callback(response) {
    if (response.error) {
        console.error('error', response.error)
        showErrorMsg('googleLoginFailed')
    } else {
        getCredFromGoogle(response)
    }

}

async function login(type, credential) {
    try {
        isLoading.value[type] = true

        let loggedUser = null
        if (type === 'credentials') {

            loggedUser = await userStore.login(type, { email: credential.email, password: credential.password })

        } else {
        
            loggedUser = await userStore.login(type, credential)
        }

        if (loggedUser) {
            router.push('/')
            showSuccessMsg('loginSuccess')

        }


    } catch (error) {
        console.log('error', error);
    }
}



async function getCredFromGoogle({ credential }) {
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

            &.loading {
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

.google-login{
    background: none;
    border: none;
    
}

</style>