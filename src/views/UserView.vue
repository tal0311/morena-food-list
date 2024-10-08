<template>
    <section class="user-page grid">

        <UserPreview :user="user" />
        <h1> {{ getTitle(user.username) }} <span>👋</span></h1>
        <details>
            <summary>{{ $trans('user-info') }}</summary>
            <section class="summary-container grid">
                <div>
                    <input type="text" v-model="user.username">
                </div>
                <button class="special-btn" @click="logout">{{$trans('logout') }}</button>
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
                        <input type="checkbox" name="notifications" v-model="user.settings.notifications"
                            class="switch">
                    </div>
                    <div class="lang-container grid">
                        <label class="language-label" for="lang">{{ $trans('select-language') }}</label>
                        <select name="lang" id="" v-model="user.settings.lang">
                            <option value="">{{ $trans('select-language') }}</option>
                            <option value="en">English</option>
                            <option value="es">español</option>
                            <option value="he">עברית</option>
                        </select>

                    </div>
                    <section class="preferences grid">
                        <label v-for="diet in diets" :for="diet.label">
                            {{ $trans(diet.label) }}
                            <input type="checkbox" name="diet" @change="updateUser" :id="diet.label"
                                v-model="user.settings[diet.value]">
                        </label>
                    </section>



                </div>

            </section>


        </details>

        <details v-if="user.labelOrder">
            <summary>
                {{ $trans('group-order') }}
            </summary>
            <section class="group-order-container">
                <ul class="group-list clean-list grid">
                    <li v-for="label, idx in user.labelOrder" class="grid grid-dir-col">
                        <span> {{ $trans(label) }} </span>
                        <div class="btn-container grid grid-dir-col">
                            <button class="icon-svg icon" v-html="$svg('up_arrow')"
                                @click="setGroupOrder(label, idx, -1)" :disabled="idx === 0"></button>
                            <button class="icon-svg icon" v-html="$svg('down_arrow')"
                                @click="setGroupOrder(label, idx, 1)"
                                :disabled="idx === user.labelOrder.length - 1"></button>
                        </div>

                    </li>
                </ul>
            </section>

        </details>
        <details>
            <summary>
                <div>{{ $trans('my-lists') }}
                    <small class="counter">({{ historyCounter }})</small>
                </div>
            </summary>
            <section class="history-container">
                <ul v-if="lists" class="history-list clean-list grid">
                    <li v-for="list in lists" :key="list._id" class="grid grid-dir-col">
                        <small>{{ formatDate(list.createdAt) }}</small>
                        <small>{{ list.title }}</small>
                        <RouterLink :to="`/list/${list._id}`">
                            <span class="secondary-btn">{{ $trans('restore') }}</span>
                        </RouterLink>
                    </li>
                </ul>
                <p v-else>{{ $trans('no-history') }}</p>
                <button class="public-list-btn primary-btn" @click="loadPublicLists">
                    {{$trans(btnSate)}}
                </button>
          
                <ul v-if="publicLists" class="public-list clean-list grid">
                    <li v-for="list in publicLists" :key="list._id" class="grid grid-dir-col">
                        <small>{{ formatDate(list.createdAt) }}</small>
                        <small>{{ list.title }}</small>
                        <RouterLink :to="`/list/${list._id}`">
                            <span class="secondary-btn">{{ $trans('restore') }}</span>
                        </RouterLink>
                    </li>
                </ul>

            </section>
        </details>
     
        <details>
            <summary>{{ $trans('personal-notes') }}</summary>
            <section class="notes-container">
                <textarea name="" v-model="user.personalTxt"
                    placeholder="Notes from here will show in your list"></textarea>

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
import { ref, onBeforeMount, onUpdated, computed } from 'vue'
import { utilService } from '@/services/util.service';
import { useUserStore } from '@/stores/user-store'
import { userService } from '@/services/user.service';
import { listService } from '@/services/list.service';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useListStore } from '@/stores/list-store';
import {useRouter} from 'vue-router'
import UserPreview from '@/components/UserPreview.vue'

const user = ref(null);
const userStore = useUserStore();

const diets = [
    { name: 'vegan', label: 'vegan', value: 'isVegan' },
    { name: 'vegetarian', label: 'vegetarian', value: 'isVegetarian' },
    { name: 'glutenFree', label: 'gluten-free', value: 'isGlutenFree' },
    { name: 'lactoseFree', label: 'lactose-free', value: 'isLactoseFree' },
    { name: 'kosher', label: 'kosher', value: 'isKosher' }

]

const listStore = useListStore();
const lists = computed(() => listStore.userLists)
const btnSate = ref('import-public-lists')
const publicLists = ref([])


onBeforeMount(async () => {
    user.value = userService.getLoggedInUser();
    await listStore.loadLists()
})

async function loadPublicLists() {
    btnSate.value ='loading-public-lists'
    publicLists.value = await listService.query({ visibility: 'public' })
    if (!publicLists.value.length) {
        btnSate.value = 'no-public-lists'
        return
    }
    btnSate.value = 'public-lists'

}

function setGroupOrder(label, idx, dir) {
    const labelToMove = user.value.labels.find(l => l.name === label)
    user.value.labels.splice(idx, 1)
    user.value.labels.splice((idx + dir), 0, labelToMove)

    user.value.labelOrder = user.value.labels.map(l => l.name)
    updateUser()
}

const isFirstLoad = ref(true);
onUpdated(() => {
    if (isFirstLoad.value) {
        isFirstLoad.value = false;
        return;
    }
    // updateUser()
})



updateUser = utilService.debounce(updateUser, 1000);

function updateUser() {
    userStore.updateLoggedUser(user.value);
    showSuccessMsg('userUpdated');
}

function getTitle(username) {
    const elBody = document.querySelector('body')
    return elBody.dir === 'rtl' ? `שלום, ${username}` : `Hi, ${username}`;

}
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
};

const router = useRouter()
async function logout() {
    await userStore.logout();
    router.push('/login');
}

const historyCounter = computed(() => lists?.value?.length || 'No history');
</script>

<style scoped>
.history-list,.public-list {
    gap: 0.5rem;
    padding: 0.5rem;

    li {
        /* justify-content: space-between; */
        grid-template-columns: min-content 1fr min-content;
        align-items: center;
        gap: 0.5rem;

        small {
            font-size: 1rem;

            &:last-of-type {
                /* font-size: 1.2rem; */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

}

.secondary-btn {
    padding: 0.2rem 0.8rem;
}

.user-page {
    font-size: 1.5rem;
    gap: 1rem;
    width: 100%;
    padding-block: 5rem;
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

    .counter {
        color: var(--bClr3);
    }
}

summary::-webkit-details-marker {
    display: none
}


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

.notify-container {
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
}

.summary-wrapper {
    display: grid;
    gap: 1.2rem;
}

.lang-container,
.level-container {
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
    -moz-appearance: none;
    appearance: none;
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

textarea {
    /* margin-block: 1rem; */
    outline: 1px solid var(--bClr1);
    resize: none;
    width: 100%;
    border: none;
    padding: 0.3rem;
    font-family: inherit;
    font-size: 1.5rem;
}

.preferences label {
    margin-inline-start: 3rem;
    grid-template-columns: 50% 50%;
    display: grid;
    grid-auto-flow: column;
    accent-color: var(--bClr3);
}

.language-label {
    margin-block: 0.5rem;
}


.group-order-container {
    .group-list {
        gap: 1rem;

        li {
            justify-content: space-between;

            .btn-container {
                gap: 1rem;

                button {
                    &:disabled {
                        opacity: 0.2;
                    }
                }
            }
        }
    }
}
.public-list-btn.primary-btn{
    padding: 0.5rem 1rem;
    margin-block: 1rem;
    width: 100%;
}

.summary-container {
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--bClr1);
    border-radius: 2px;
    margin-block: 1rem;

    .special-btn {
        padding: 0.5rem 1rem;
        width: 100%;
    }
}
</style>