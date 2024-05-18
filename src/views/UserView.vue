<template>
    <section class="user-page grid">
        <h1> {{ getTitle(user.username) }} <span>👋</span></h1>
        <details>
            <summary>{{ $trans('user-info') }}</summary>
            <section class="summary-container">
                <div>
                    <input type="text" v-model="user.username">
                </div>

            </section>
        </details>

        <details>
            <summary>{{ $trans('goals-and-pref') }}</summary>
            <section class="summary-container">
                <label for="level">{{ $trans('level') }}</label>
                    <div class="level-container grid">
                        
                            <select name="level" id="" v-model.number="user.level">
                                <option value="0" selected>{{ $trans('level') }}</option>
                                <option value="1">{{ $trans('beginner') }}</option>
                                <option value="2">{{ $trans('intermediate') }}</option>
                                <option value="3">{{ $trans('advanced') }}</option>

                            </select>

                        </div>
                

            </section>
        </details>

        <details>
            <summary>{{ $trans('settings') }}</summary>
            <section class="summary-container">
                <div class="summary-wrapper">


                    <div class="notify-container grid">
                       


                        <label for="notifications">{{ $trans('notifications') }}</label>
                        <!-- <input type="checkbox" > -->
                        <input type="checkbox" name="notifications" v-model="user.settings.notifications" class="switch">
                    </div>
                    <div class="lang-container grid">
                        <select name="lang" id="" v-model="user.settings.lang">
                            <option value="">{{ $trans('select-language') }}</option>
                            <option value="en">English</option>
                            <option value="es">español</option>
                            <option value="he">עברית</option>

                        </select>

                    </div>
                </div>

            </section>
        </details>

        <details>
            <summary>History</summary>
            <section class="history-container">
                <ul v-if="user.history.length">
                    <li v-for="history in user.history" :key="history.id">
                        <span>{{ history.date }}</span> | 
                        <RouterLink :to="history.url">
                            <span>visit</span>
                        </RouterLink>
                    </li>
                </ul>
                <p v-else>No history at the moment</p>
            </section>
        </details>

        <footer>
            <RouterLink to="/list" class="primary-btn">
                <span>{{ $trans('start-shopping') }}</span>
            </RouterLink>
        </footer>

    </section>
</template>

<script setup>
import { ref, onBeforeMount, onUpdated } from 'vue'
import { utilService } from '@/services/util.service';
import { useUserStore } from '@/stores/user-store'
import { userService } from '@/services/user.service';
import {showSuccessMsg ,eventBus } from '@/services/event-bus.service';





const user = ref(null);
const userStore = useUserStore();



onBeforeMount(() => {
    user.value = userService.getLoggedInUser();

})

onUpdated(() => {
    updateUser()
})



updateUser = utilService.debounce(updateUser, 1000);

function updateUser() {
    console.log('updating user, ', user.value);
    userStore.updateLoggedUser(user.value);
    showSuccessMsg('User updated successfully');
}

function getTitle(username) {
    const elBody = document.querySelector('body')
    return elBody.dir === 'rtl' ? `שלום, ${username}` : `Hi, ${username}`;

}
</script>

<style scoped>
.user-page {
    font-size: 1.5rem;
    gap: 1rem;
    width: 100%;
}

footer {

    span {
        padding-block: 0.5em;
        font-size: 1.2rem;

    }

}


details {
    width: 100%;
    box-shadow: 0 0 2px 0px var(--clr4);
    /* outline: 1px solid #c9c9c9; */
    border-radius: 2px;
    padding: 0.5em 0.5em 0;

    summary {
        display: grid;
        grid-auto-flow: column;
        position: relative;
        margin: -0.5em -0.5em 0;
        padding: 0.5em;
        color: var(--clr7);
        text-transform: capitalize;
        cursor: pointer;
        grid-template-columns: 1fr 20px;




        &::marker {
            color: var(--clr7);


            /* content:'' */
        }

        &.has-items .counter {
            color: var(--bClr3);
        }

    }

    &[open] {
        padding: 0.5em;

    }

    &[open] summary {
        /* box-shadow: 0 0 2px 0px #c9c9c9; */
        margin-bottom: 0.5em;
    }


}


details>summary {

    list-style: none;
}

summary::-webkit-details-marker {
    display: none
}

/* summary::after {
    content: " ►";
    color: var(--clr7);
}

details[open] summary:after {
    content: " ▼";
    color: var(--clr5);
} */


input[type="text"] {

    color: inherit;
    padding: 0.5em;
    font-size: 1rem;
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--bClr3);

    &:focus {
        outline: 1px solid var(--bClr5);
        border-radius: 2px;
        border: none;
    }
}

.notify-container{
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
}

.summary-wrapper {
    display: grid;
    gap: 1.2rem;
}

.lang-container, .level-container  {
    select {
        padding: 0.5em;
        font-size: 1rem;
        border: 1px solid var(--bClr1);
        background-color: var(--bClr2);
        /* border-bottom: 1px solid var(--bClr3); */
        font-size: 1.2rem;

        &:focus {
            outline: 1px solid var(--bClr5);
            border-radius: 2px;
            border: none;
        }

        option {
            font-size: 1.2rem;
            width: 100%;
        }
    }

}


.switch {
    -webkit-appearance: none;
    position: relative;
    border-radius: 100vh;
    width: 2.5rem;
    height: 1.5rem;
    border: solid 1px var(--bClr5);
    background: var(--bClr5);
    overflow: hidden;
    transition: all .1s ease-out;
}

.switch:checked {
    background: var(--bClr1);
    border: solid 1px var(--bClr1);
}

.switch:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
}

.switch:after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background: #fff;
    transition: all .1s ease-out;
}

.switch:checked:after {
    left: 1rem;
}
</style>