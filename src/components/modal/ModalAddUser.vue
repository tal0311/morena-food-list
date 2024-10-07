<template>

    <section v-if="user" class="modal-add-user">


        <form @submit.prevent="" class="grid grid-dir-cols">

            <label  class="grid grid-dir-cols">
                Username
                <input type="text" v-model="user.username" placeholder="name" required />
            </label>

            <label  class="grid grid-dir-cols">
                Email <small>(changing this will require the user to re-login)</small>
                <input type="text" v-model="user.email" placeholder="email" disabled required />
            </label>

            <label  class="grid grid-dir-cols">
                Role <small>(this will set permissions for the user)</small>
                <input type="text" v-model="user.role" placeholder="role" required />

            </label>

            <label  class="grid grid-dir-cols">
                Password <small>(leave empty to keep the same)</small>
                <input :type="`${!isPasswordVisible? 'password' :'text'}`" v-model="user.password" placeholder="Can't see other users password"  />
                <button @click="displayPasswd">See Password</button>
            </label>

            <div>
                <label >
                    Excluded items
                    <input type="text" class="items-input" list="list-items" v-model="selectedItem"
                    placeholder="Select item">
                    <button class="primary-btn" @click="AddItem">Add</button>
                    
                    <ul v-if="user.exItems" class="small-item-list">
                        <li v-for="item in user.exItems" class="grid grid-dir-col">
                            <span>{{ item.name }}</span>
                            <button class="icon-svg" type="button" @click.stop="removeFromList(item._id)"
                            v-html="$svg('close')"></button>
                        </li>
                    </ul>
                </label>
            </div>



            <button class="secondary-btn" type="submit" @click="saveUser">{{ user._id ? 'Update' : 'Add' }}</button>

        </form>

    </section>


    <section>
        <datalist id="list-items">
            <div v-for="item in items" :key="item._id">
                <option v-if="!isItemInList(item.name)" :value="item.name"></option>
            </div>

        </datalist>
    </section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { userService } from '@/services/user.service';
import { itemService } from '@/services/item.service';
import { eventBus } from '@/services/event-bus.service';
const props = defineProps(['info'])
const emit = defineEmits(['resetModal'])

const selectedItem = ref('')
const user = ref(null)
const items = ref(null)
onBeforeMount(async () => {
    items.value = await itemService.query()
    if (props.info) {
        props.info.exItems = items.value.filter(item => props.info.exItems.includes(item._id))
        user.value = props.info
    } else {
        user.value = userService.getEmptyUser()
    }

})

function isItemInList(itemName) {
    const isItemInList = user.value.exItems.find(item => item.name === itemName)
    return isItemInList ? true : false
}

function AddItem() {
    const item = items.value.find(item => item.name === selectedItem.value)
    if (!item) return
    user.value.exItems.push(item)
    selectedItem.value = ''
}

function removeFromList(itemId) {
    user.value.exItems = user.value.exItems.filter(i => i._id !== itemId)
}

async function saveUser() {
    const userToSave = JSON.parse(JSON.stringify(user.value))
    userToSave.exItems = userToSave.exItems.map(item => item._id)
    await userService.save(userToSave)
    if (userToSave._id){
        eventBus.emit('user-updated', userToSave)
    }else{
        eventBus.emit('user-added', userToSave)
    }
    
    emit('resetModal')
}

const isPasswordVisible = ref(false)
function displayPasswd(){
    isPasswordVisible.value = !isPasswordVisible.value
  
}
</script>

<style scoped>
.modal-add-user {
    background-color: #fff;
    padding: 1rem;
    border-radius: var(--br);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);



    form {
        gap: 1rem;

        label {

            font-size: 1.2rem;
            gap: 0.5rem;

            input {
                color: var(--bClr3);
                padding: 0.2rem 0.5rem;
                border-radius: var(--br);
                font-size: inherit;
                border: 1px solid var(--bClr3);

                &::placeholder {
                    color: var(--bClr1);
                }
            }


        }

        .secondary-btn {
            max-width: 100px;
            padding: 0.5rem 1rem;
        }
    }
}

.small-item-list {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 0;

    li {
        align-items: center;
        background-color: var(--bClr1);
        grid-template-columns: 1fr auto;
        padding: 0.3rem 0.5rem;
        border-radius: var(--br);

        .icon-svg {
            border: none;
            /* background-color: var(--bClr4); */
            border-radius: 50%;
            padding: 0.2rem;
        }
    }
}

.primary-btn {
    padding: 0.5rem;
    max-width: max-content;
}
</style>