<template>
    <section v-if="user" class="modal-add-user dashboard-modal">

        
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">{{ user._id ? 'Update' : 'Add' }} User</h2>
            </div>
            <form @submit.prevent="" class="modal-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="user.username" placeholder="Enter username" required />
                </div>

                <div class="form-group">
                    <label for="email">Email <small>(changing this will require the user to re-login)</small></label>
                    <input type="email" id="email" v-model="user.email" placeholder="Enter email" disabled required />
                </div>

                <div class="form-group">
                    <label for="role">Role <small>(this will set permissions for the user)</small></label>
                    <select id="role" v-model="user.role" required>
                        <option value="">Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="guest">Guest</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="password">Password <small>(leave empty to keep the same)</small></label>
                    <div class="modal-grid modal-grid-2">
                        <input :type="`${!isPasswordVisible? 'password' :'text'}`" id="password" v-model="user.password" placeholder="Can't see other users password" />
                        <button type="button" class="modal-btn modal-btn-secondary" @click="displayPasswd">See Password</button>
                    </div>
                </div>

                <div class="section-divider">
                    <h3>Excluded Items</h3>
                    <p>Select items that this user should not see in their lists</p>
                </div>

                <div class="form-group">
                    <label for="excluded-items">Add Excluded Items</label>
                    <div class="modal-grid modal-grid-2">
                        <input type="text" id="excluded-items" class="items-input" list="list-items" v-model="selectedItem" placeholder="Select item">
                        <button type="button" class="modal-btn modal-btn-primary" @click="AddItem">Add</button>
                    </div>
                    
                    <ul v-if="user.exItems && user.exItems.length" class="small-item-list">
                        <li v-for="item in user.exItems" :key="item._id" class="grid grid-dir-col">
                            <span>{{ item.name }}</span>
                            <button class="icon-svg" type="button" @click.stop="removeFromList(item._id)" v-html="$svg('close')"></button>
                        </li>
                    </ul>
                    <div v-else class="no-items-message">
                        <span>No excluded items selected</span>
                    </div>
                </div>
            </form>
            <div class="modal-actions grid grid-dir-col">
                <button class="modal-btn modal-btn-secondary" @click="$emit('resetModal')">Cancel</button>
                <button class="modal-btn modal-btn-primary" @click="saveUser">{{ user._id ? 'Update' : 'Add' }}</button>
                <section>
                    <datalist id="list-items">
                        <div v-for="item in items" :key="item._id">
                            <option v-if="!isItemInList(item.name)" :value="item.name"></option>
                        </div>
                    </datalist>
                </section>
            </div>
        </div>

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
    display: grid;
    grid-template-columns: 1rem 1fr 1rem;
    grid-template-rows: 1rem auto 1rem;


    .modal-content{
        grid-column: 2;
        grid-row: 2;
    }
    
   
    /* Basic form styling */
    .modal-form {
        display: grid;
        gap: 1rem;
        width: 100%;
    }

    .form-group {
        display: grid;
        gap: 0.5rem;
        width: 100%;
    }

    /* Label styling */
    .form-group label {
        font-weight: 500;
        font-size: 0.9rem;
        color: var(--clr7);
    }

    /* Input styling */
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid var(--clr2);
        border-radius: 4px;
        font-size: 0.9rem;
        background-color: var(--clr10);
        color: var(--clr8);
        width: 100%;
        box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--clr26);
        box-shadow: 0 0 0 2px rgba(68, 138, 255, 0.25);
    }

    /* Button styling */
    .modal-btn {
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .modal-btn-primary {
        background-color: var(--clr26);
        color: white;
    }

    .modal-btn-primary:hover {
        background-color: var(--clr26);
        opacity: 0.9;
    }

    .modal-btn-secondary {
        background-color: var(--clr2);
        color: var(--clr8);
    }

    .modal-btn-secondary:hover {
        background-color: var(--clr3);
    }

    /* Grid layouts */
    .modal-grid {
        display: grid;
        gap: 0.5rem;
    }

    .modal-grid-2 {
        grid-template-columns: 1fr auto;
    }

    /* Section divider */
    .section-divider {
        border-top: 1px solid var(--clr2);
        padding-top: 1rem;
        margin-top: 1rem;
    }

    .section-divider h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: var(--clr7);
    }

    .section-divider p {
        margin: 0;
        font-size: 0.8rem;
        color: var(--clr6);
    }

    /* Item list styling */
    .small-item-list {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        padding: 0;
        margin-top: 0.5rem;
    }

    .small-item-list li {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        background-color: var(--clr1);
        padding: 0.5rem;
        border-radius: 4px;
        gap: 0.5rem;
    }

    .small-item-list .icon-svg {
        border: none;
        background-color: var(--clr4);
        border-radius: 50%;
        padding: 0.2rem;
        cursor: pointer;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .small-item-list .icon-svg:hover {
        background-color: var(--clr5);
    }

    /* No items message */
    .no-items-message {
        text-align: center;
        padding: 1rem;
        color: var(--clr6);
        font-style: italic;
    }

    .modal-actions{
        grid-template-columns: 1fr 1fr;
      
      
    }
}
</style>