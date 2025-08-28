<template>
    <section v-if="user" class="dashboard-modal">

        
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
            <div class="modal-actions">
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
@import '@/assets/modal-forms.css';
</style>