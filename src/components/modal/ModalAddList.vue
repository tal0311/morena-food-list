<template>
    <section v-if="items" class="modal-add-list">
        <h2>Create New Item list</h2>

        <form ref="fromRef" class="grid" @submit.prevent="">
            <label v-for="value, key in listToAdd" :for="key">
                <h3>{{ key }}</h3>
                <div v-if="key === 'items'">
                    <input type="text" class="items-input" list="list-items" v-model="selectedItem"
                        placeholder="Select item">
                    <button class="primary-btn" @click="AddItem">Add</button>

                    <ul v-if="listToAdd.items.length" class="small-item-list">
                        <li v-for="item in listToAdd.items" class="grid grid-dir-col">
                            <span>{{ item.name }}</span>
                            <button class="icon-svg" type="button" @click.stop="removeFromList(item._id)"
                                v-html="$svg('close')"></button>
                        </li>
                    </ul>
                    <div v-else>
                        <span>No items in list</span>
                    </div>
                </div>
                <div v-if="key === 'visibility'">
                    <span>
                        Public
                        <input type="radio" name="visibility" value="public" v-model="listToAdd[key]">
                    </span>
                    <span>
                        Private
                        <input type="radio" name="visibility" value="private" v-model="listToAdd[key]">
                    </span>
                </div>

                <UserPreview v-if="key === 'owner'" :user="value" display="create-list">
                    user: {{ value.username }}
                </UserPreview>



                <input v-if="['createdAt', 'updatedAt', 'title'].includes(key)" type="text" :name="key"
                    v-model="listToAdd[key]" required>


            </label>

            <button type="submit" class="primary-btn" @click="saveList">Save Changes</button>
        </form>

        <datalist id="list-items">
            <div v-for="item in items" :key="item._id">
                <option v-if="!isItemInList(item.name)" :value="item.name"></option>
            </div>

        </datalist>
    </section>
</template>

<script setup>
import { adminService } from '@/services/admin.service';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { itemService } from '@/services/item.service';
import { userService } from '@/services/user.service';
import UserPreview from '../UserPreview.vue';




const route = useRoute();
const listToAdd = ref(null)

const items = ref(null)
const selectedItem = ref('')
onBeforeMount(async () => {

    await loadItems()
    const { _id: id, imgUrl, username } = userService.getLoggedInUser()
    if (route.params.id) {
        console.log('Editing list with id:', route.params.id);
    } else {

        listToAdd.value = adminService.getEmptyList()
        listToAdd.value.createdAt = new Date().toISOString().split('T')[0]
        listToAdd.value.updatedAt = new Date().toISOString().split('T')[0]
        listToAdd.value.owner = { _id: id, imgUrl, username }

    }

})

async function loadItems() {
    items.value = await itemService.query()
    console.log('items', items.value);
}

function AddItem() {


    const item = items.value.find(item => item.name === selectedItem.value)
    // const item = items.value.find(item => item.name === itemRef.value)
    if (!item) return
    listToAdd.value.items.push(item)
    selectedItem.value = ''
}
function isItemInList(itemName) {
    const isItemInList = listToAdd.value?.items.find(item => item.name === itemName)
    return isItemInList ? true : false

}

function removeFromList(itemId) {
    const idx = listToAdd.value.items.findIndex(item => item._id !== itemId)
    listToAdd.value.items.splice(idx, 1)
}

function saveList() {
    listToAdd.value.items = listToAdd.value.items.map(item => item._id)

    console.log('listToAdd', listToAdd.value)
    //  listToAdd.value
    // adminService.saveList(listToAdd.value)
    // eventBus.$emit('show-msg', { txt: 'List saved', type: 'success' })
}
</script>

<style scoped>
h3 {
    margin: 0;
    text-transform: capitalize;
}

.modal-add-list {
    form {
        gap: 1rem;

    }
}

.in-list {
    background-color: red;
}

.small-item-list {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 0;

    li {
        align-items: center;
        background-color: var(--bClr2);
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

label {
    display: grid;
    gap: 1rem;
    grid-template-columns: 20% 1fr;
    align-items: center;
    background-color: var(--bClr1);
    padding: 0.5rem;
}

input,
select {
    padding: 0.2rem 1rem;
    border-radius: var(--br);
    border: 1px solid var(--bClr2);
    font-size: larger;

    &.items-input {
        margin-bottom: 0.5rem;
    }
}

input[type="radio"] {
    margin: 0 0.5rem;

}

.primary-btn {
    padding: 0.5rem;
    max-width: max-content;
}
</style>