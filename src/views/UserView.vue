<template>
    <section class="user-page grid">

        <UserPreview :user="user" />
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
                            <input type="checkbox" name="diet" :id="diet.label" v-model="user.settings[diet.value]">
                        </label>
                    </section>

                </div>

            </section>
        </details>

        <details>
            <summary>
                <div>{{ $trans('history') }}
                    <small class="counter">({{ historyCounter }})</small>
                </div>
            </summary>
            <section class="history-container">
                <ul v-if="history" class="history-list clean-list grid">
                    <li v-for="list in history" :key="history.id" class="grid grid-dir-col">
                        <small>{{ formatDate(list.createdAt) }}</small>
                        <small>{{ list.title }}</small>
                        <RouterLink :to="`/list/${list._id}/`">
                            <span class="secondary-btn">{{ $trans('restore') }}</span>
                        </RouterLink>
                    </li>
                </ul>
                <p v-else>{{ $trans('no-history') }}</p>
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
import { showSuccessMsg, eventBus } from '@/services/event-bus.service';
import { useListStore } from '@/stores/list-store';
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
const history = computed(() => listStore.userLists)

onBeforeMount(async () => {
    user.value = userService.getLoggedInUser();
    await listStore.loadLists()

})


const isFirstLoad = ref(true);
onUpdated(() => {
    if (isFirstLoad.value) {
        isFirstLoad.value = false;
        return;
    }
    updateUser()
})



updateUser = utilService.debounce(updateUser, 1000);

function updateUser() {
    userStore.updateLoggedUser(user.value);
    showSuccessMsg('User updated successfully');
}

function getTitle(username) {
    const elBody = document.querySelector('body')
    return elBody.dir === 'rtl' ? `שלום, ${username}` : `Hi, ${username}`;

}
function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
};

const historyCounter = computed(() => history?.value?.length || 'No history');
</script>

<style scoped>
.history-list {
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
</style>