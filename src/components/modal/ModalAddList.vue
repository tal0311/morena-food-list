<template>
    <section v-if="items" class="dashboard-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Create New Item List</h2>
            </div>
            <form ref="fromRef" class="modal-form" @submit.prevent="">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" v-model="listToAdd.title" required>
                </div>

                <div class="form-group">
                    <label for="visibility">Visibility</label>
                    <div class="modal-grid modal-grid-2">
                        <label class="radio-label">
                            <input type="radio" name="visibility" value="public" v-model="listToAdd.visibility">
                            <span>Public</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="visibility" value="private" v-model="listToAdd.visibility">
                            <span>Private</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="items">Items</label>
                    <ModalItemList :listToAdd="listToAdd" v-model="selectedItem" :items="items" @addItem="AddItem"
                        @removeFromList="removeFromList" :key="cmpKey"></ModalItemList>
                </div>

                <div class="form-group">
                    <label for="owner">Owner</label>
                    <UserPreview :user="listToAdd.owner" display="create-list">
                        user: {{ listToAdd.owner.username }}
                    </UserPreview>
                </div>
            </form>
            
            <div class="modal-actions">
                <button class="modal-btn modal-btn-secondary" @click="$emit('resetModal')">Cancel</button>
                <button class="modal-btn modal-btn-primary" @click="saveList">Save Changes</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { adminService } from '@/services/admin.service';
import { ref, onBeforeMount } from 'vue';
import { itemService } from '@/services/item.service';
import { userService } from '@/services/user.service';
import UserPreview from '../UserPreview.vue';
import { listService } from '@/services/list.service';
import { eventBus } from '@/services/event-bus.service';
import ModalItemList from '@/components/ModalItemList.vue';

const listToAdd = ref(null)

const items = ref(null)
const selectedItem = ref('')

const props = defineProps(['info'])
const emit = defineEmits(['resetModal'])
onBeforeMount(async () => {

    await loadItems()

    const { _id: id, imgUrl, username } = userService.getLoggedInUser()
    if (props.info) {
        loadList()
    } else {
        loadEmptyList({ id, imgUrl, username })
    }

})

async function loadItems() {
    items.value = await itemService.query()
}

async function loadList() {
    const list = await listService.getById(props.info._id)
    list.items = items.value.filter(item => list.items.includes(item._id))
    listToAdd.value = list
    // listToAdd.value.owner = { _id: id, imgUrl, username }
    const hDate = new Date().toISOString().split('T')[0]
    listToAdd.value.createdAt = hDate
    listToAdd.value.updatedAt = hDate
}

function loadEmptyList({ id, imgUrl, username }) {
    listToAdd.value = adminService.getEmptyList()
    const hDate = new Date().toISOString().split('T')[0]
    listToAdd.value.createdAt = hDate
    listToAdd.value.updatedAt = hDate
    listToAdd.value.owner = { id, imgUrl, username }
}

const cmpKey = ref(0)
function AddItem() {
    const item = items.value.find(item => item.name === selectedItem.value)
    if (!item) return
    listToAdd.value.items.push(item)
    selectedItem.value = ''
    cmpKey.value++
}

function isItemInList(itemName) {
    const isItemInList = listToAdd.value?.items.find(item => item.name === itemName)
    return isItemInList ? true : false
}

function removeFromList(itemId) {
    listToAdd.value.items = listToAdd.value.items.filter(i => i._id !== itemId)
}

async function saveList() {
    const listToSave = JSON.parse(JSON.stringify(listToAdd.value))
    listToSave.items = listToSave.items.map(item => item._id)
    await listService.save(listToSave)
    eventBus.emit('list-added', listToAdd.value)
    emit('resetModal')
}
</script>

<style scoped>
@import '@/assets/modal-forms.css';

/* Additional styles specific to ModalAddList */
h3 {
    margin: 0;
    text-transform: capitalize;
}

.in-list {
    background-color: red;
}

.primary-btn {
    padding: 0.5rem;
    max-width: max-content;
}
</style>