<template>
    <section class="main-layout login-view">
        <h1>Login</h1>
        <button class="secondary-btn" @click="login('guest')">Continue as guest</button>
        <div class="sep-container grid grid-dir-col">

            <span class="sep"></span> <span class="or">OR</span> <span class="sep"></span>
        </div>
        <!-- <GoogleLogin :callback="callback" prompt auto-login /> -->
        <GoogleLogin :callback="callback" prompt auto-login/>
    </section>

</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { decodeCredential } from 'vue3-google-login'
import { useUserStore } from '@/stores/user-store';
import { useRouter } from 'vue-router';


const userStore = useUserStore()
const userCredFromGoogle = ref(null)
const  router = useRouter()

function callback(response) {
    if (response.error) {
        console.error('error', response.error)
    } else {
        getCredFromGoogle(response)
    }

}

async function login(type,credential) {
    try {
        
       await userStore.login(type,credential)
        router.push('/')
    } catch (error) {
        console.error('error', error)
        login('guest')
        
    }
}

function getCredFromGoogle({ credential }) {
    userCredFromGoogle.value = decodeCredential(credential)
    userCredFromGoogle.value.jwt= credential
    login('google', userCredFromGoogle.value)
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
}

.sep-container {
    gap : 0.5rem;
    color: var(--clr5);
    width: 100%;
    /* background: aliceblue; */
    grid-template-columns: 1fr auto 1fr;
    align-items: center;

    .or{
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
        div[role="button"]{

            height: 42px;
            border: 1px solid #7c94bb;
            border-radius: 8px;
        }
        
    }


</style>