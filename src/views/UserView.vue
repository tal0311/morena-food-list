<template>
    <section class="user-page grid" v-if="user">

        <UserPreview :user="user" />
        <h1> {{ getTitle(user.username) }} <span>👋</span></h1>
        <!-- user info -->
        <details>
            <summary>{{ $trans('user-info') }}</summary>
            <section class="summary-container grid">
                <div>
                    <input type="text" v-model="user.username">
                </div>
                <button class="special-btn" @click="logout">{{$trans('logout') }}</button>
            </section>
        </details>
       <!-- goals and preferences -->
        <details>
            <summary>{{ $trans('goals-and-pref') }}</summary>
            <section class="summary-container">
                <label for="level">{{ $trans('level') }}</label>
                <div class="level-container grid">

                    <select name="level" id="" v-model.number="user.level">
                      <option v-for="(label, index) in ['level', 'beginner', 'intermediate', 'advanced']" :key="index" :value="index">
                        {{ $trans(label) }}
                      </option>
                    </select>

                </div>


            </section>
        </details>

        <!-- settings -->
        <details>
            <summary>{{ $trans('settings') }}</summary>
            <section class="summary-container">
                <div class="summary-wrapper">
                    <div class="notify-container grid">
                        <!-- <pre>{{ user.settings.notifications }}</pre> -->
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
                            <input type="checkbox" name="diet" :id="diet.label"
                                v-model="user.settings[diet.value]">
                        </label>
                    </section>



                </div>

            </section>


        </details>
        <!-- group order -->
        <details v-if="user.labelOrder">
            <summary>
                {{ $trans('group-order') }}
            </summary>
            <section class="group-order-container">
                <draggable 
                    v-model="user.labelOrder" 
                    class="group-list clean-list grid"
                    item-key="name"
                    @end="onDragEnd"
                    ghost-class="ghost-item"
                    chosen-class="chosen-item"
                    handle=".drag-handle"
                >
                    <template #item="{ element: label, index: idx }">
                        <li class="grid grid-dir-col drag-item">
                            <span> {{ $trans(label) }} </span>
                            <div class="drag-handle">
                                <span class="drag-icon">⋮⋮</span>
                            </div>
                        </li>
                    </template>
                </draggable>
            </section>

        </details>
        <!-- my lists -->
        <details>
            <summary>
                <div>{{ $trans('my-lists') }}
                    <small class="counter">({{ historyCounter }})</small>
                </div>
            </summary>
            <section class="history-container">
               <ShopListList :lists="user.lists" @selectList="getListById" :currList="currList"/>
                <button class="public-list-btn primary-btn" @click="loadPublicLists">
                    {{$trans(btnSate)}}
                </button>
                <ShopListList :lists="publicLists" @selectList="getListById" :currList="currList"/>
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
import { ref, onBeforeMount, computed, watch } from 'vue'
import { utilService } from '@/services/util.service';
import { useUserStore } from '@/stores/user-store'
import { userService } from '@/services/user.service';
import { listService } from '@/services/list.service';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useListStore } from '@/stores/list-store';
import {useRouter,useRoute} from 'vue-router'
import UserPreview from '@/components/UserPreview.vue'
import ShopListList from '@/components/ShopListList.vue'
import draggable from 'vuedraggable';


const route = useRoute()
const router = useRouter()
const userStore = useUserStore()


const diets = [
    { name: 'vegan', label: 'vegan', value: 'isVegan' },
    { name: 'vegetarian', label: 'vegetarian', value: 'isVegetarian' },
    { name: 'glutenFree', label: 'gluten-free', value: 'isGlutenFree' },
    { name: 'lactoseFree', label: 'lactose-free', value: 'isLactoseFree' },
    { name: 'kosher', label: 'kosher', value: 'isKosher' }

]
const user = ref(null)
const currList = ref(null)
// const listStore = useListStore();

// const lists = computed(() => listStore.userLists)
const btnSate = ref('import-public-lists')
const publicLists = ref([])


onBeforeMount(async () => {
    try{
        $showLoader('Loading User')
        user.value = await userService.getById(route.params.userId)
       
         } catch (error) {
        console.error('Error loading user:', error);
    }finally{
        isFirstLoad.value = false
        $hideLoader()
    }
})

// function loadUser() {
//     user.value = utilService.loadFromStorage('loggedUser', user)
// }

async function loadPublicLists() {
    btnSate.value ='loading-public-lists'
    publicLists.value = await listService.query({ visibility: 'public' })
    if (!publicLists.value.length) {
        btnSate.value = 'no-public-lists'
        return
    }
    btnSate.value = 'public-lists'

}

 async function getListById(listId) {
    try{
    currList.value = await listService.getById(listId)
    } catch (error) {
        showErrorMsg( 'error-loading-list');
        currList.value = null
    }

  
}

function onDragEnd(evt) {
    
    // עדכון סדר הקבוצות לפי המיקום החדש
    if (evt.oldIndex !== evt.newIndex) {
        debouncedUpdateUser();
    }
}

// const isFirstLoad = ref(true);
// onUpdated(() => {
//     if (isFirstLoad.value) {
//         isFirstLoad.value = false;
//         return;
//     }
//     // updateUser()
// })




const isFirstLoad = ref(true);

async function updateUser() {
    
    user.value = await userService.save(user.value);
    userStore.updateLoggedUser(user.value);
    // console.log('updateUser AFTER', user.value.settings);
    isFirstLoad.value = true
    
    showSuccessMsg('userUpdated');
}

// Debounce the updateUser function to prevent multiple rapid calls
const debouncedUpdateUser = utilService.debounce(updateUser, 1000);

// Store previous user state for comparison
const previousUser = ref(null);

// Watch for user changes and update when needed
watch(user, (newUser) => {

    if (!previousUser.value) {
        previousUser.value = JSON.parse(JSON.stringify(newUser));
        return;
    }
    
    // Check if there's an actual change in user properties
    const hasChanged = (
        newUser.username !== previousUser.value.username ||
        newUser.level !== previousUser.value.level ||
        newUser.personalTxt !== previousUser.value.personalTxt ||
        JSON.stringify(newUser.settings) !== JSON.stringify(previousUser.value.settings) ||
        JSON.stringify(newUser.labelOrder) !== JSON.stringify(previousUser.value.labelOrder)
    );
    
    if (hasChanged) {
        debouncedUpdateUser();
        previousUser.value = JSON.parse(JSON.stringify(newUser));
    }
}, { deep: true });

function getTitle(username) {
    const elBody = document.querySelector('body')
    return elBody.dir === 'rtl' ? `שלום, ${username}` : `Hi, ${username}`;

}



async function logout() {
    await userStore.logout();
    router.push('/login');
}

const historyCounter = computed(() => user.value?.lists?.length || 'No history');

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

    h1 {
        font-size: 2rem;
    }
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

.switch:not(:checked) {
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
            transition: all 0.2s ease;
            padding: 0.5rem;
            border: 1px solid transparent;
            border-radius: 4px;

            &:hover {
                background-color: var(--bClr1);
                border-color: var(--bClr3);
            }

            .drag-handle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2rem;
                height: 2rem;
                cursor: grab;

                .drag-icon {
                    font-size: 1.2rem;
                    color: var(--bClr3);
                    user-select: none;
                }
            }
        }
    }
}

.ghost-item {
    opacity: 0.5;
    background-color: var(--bClr1);
    border: 2px dashed var(--bClr3);
}

.chosen-item {
    background-color: var(--bClr2);
    border-color: var(--bClr5);
    transform: rotate(2deg);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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