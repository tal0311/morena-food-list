<template>
    <section v-if="users || items || lists" :class="['admin-view', filterBy]">

        <h1>Welcome Moran, You can update your data base from here</h1>
        <section class="admin-filter grid ">

            <section class="entity-filter grid">
                <span>Filter By: </span>

                <section class="actions-container grid grid-dir-col">

                    <button class="primary-btn" @click="setFilterBy('users')">Users</button>
                    <button class="primary-btn" @click="setFilterBy('items')">Items</button>
                    <button class="primary-btn" @click="setFilterBy('lists')">Lists</button>
                </section>
                <!-- <button class="secondary-btn" @click="addUser">Create user</button> -->
            </section>
            <form action="">
                Search: <input type="text" v-model="searchTerm" :placeholder="`Search ${filterBy}`" />

            </form>
        </section>

        <details :open="filterBy === 'users'">
            <summary>Users</summary>
            <div class="create-btn grid">
                <button @click="addUser">create</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.id">
                        <td>{{ user._id }}</td>
                        <td contenteditable>{{ user.name }}</td>
                        <td contenteditable>{{ user.email }}</td>
                        <td contenteditable>{{ user.role }}</td>
                        <td>
                            <button @click="deleteUser(user._id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </details>

        <details :open="filterBy === 'items'">
            <summary>Food Items</summary>

            <div class="create-btn grid">
                <button @click="addItem">create</button>
            </div>




            <table>
                <thead>
                  
                    <tr>
                        <th v-if="false">Id</th>
                        <th>Group</th>
                        <th>Name</th>
                        <th v-if="false">Color</th>
                        <th v-if="false">Read More URL</th>
                        <th v-if="false">Icon</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="{ _id, group, color, readMoreURL, icon, name } in filteredItems" :key="_id"
                        :class="`item-${_id}`">
                        <td v-if="false">{{ _id }}</td>
                        <td >
                            <span class="text-bold">
                                {{ group }}
                            </span>
                            <ul class="clean-list grid">
                                <li v-for="value, key in getTranslation(group)">
                                    <small>
                                        {{ key }}: {{ value }}
                                    </small>
                                </li>
                            </ul>
                        </td>
                        <td>
                            <span class="text-bold">{{ name }}</span>
                            <ul class="clean-list grid">
                                <li v-for="value, key in getTranslation(name)">
                                    <small>
                                        {{ key }}: {{ value }}
                                    </small>
                                </li>
                            </ul>
                        </td>
                        <td v-if="false">
                            {{ color }}
                        </td>
                        <td v-if="false">
                            {{ readMoreURL || 'No Read More Url' }}
                        </td>
                        <td v-if="false">{{ icon }}</td>
                        <td>
                            <div class="item actions-container grid grid-dir-col">

                                <button @click="selectItem(_id)">Select</button>
                                <button @click="removeItem(_id)">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </details>


        <details :open="filterBy === 'lists'">
            <summary>Lists</summary>
            <div class="create-btn grid">
                <button @click="addList">create</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th v-if="false">Id</th>
                        <th>Title</th>
                        <th>Items</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="list in filteredLists" :key="list._id">
                        <td v-if="false">{{ list._id }}</td>
                        <td >{{ list.title }}</td>
                        <td >{{ list.items.map(item => item.name).join(', ') }}</td>
                        <td >{{ list.owner.username }}</td>
                        <td>
                            <!-- <button @click="deleteList(list.id)">Delete</button> -->
                            <button @click="selectList(list._id)">Select</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </details>
    </section>

    <section v-else>
        <AppLoader />
    </section>
</template>

<script setup>
import { computed, ref, onBeforeMount, onBeforeUnmount, watchEffect } from 'vue';
import AppLoader from '@/components/AppLoader.vue';
import { userService } from '@/services/user.service';
import { itemService } from '@/services/item.service';
import { listService } from '@/services/list.service';
import { i18Service } from '@/services/i18n.service';
import { eventBus } from '@/services/event-bus.service';



const users = ref(null);
const items = ref(null);
const lists = ref(null);

const searchTerm = ref('');
const filterBy = ref('');

const filteredUsers = computed(() => {
    return users.value?.filter(user => {
        const regex = new RegExp(searchTerm.value, 'i');
        return user.username.match(regex) || user.email.match(regex)
    });
});

const filteredItems = computed(() => {
    return items.value?.filter(item => {
        const regex = new RegExp(searchTerm.value, 'i');
        return item.name.match(regex) || item.group.match(regex);
    });
});

const filteredLists = computed(() => {
    return lists.value?.filter(list => {
        const regex = new RegExp(searchTerm.value, 'i');
        return list.title.match(regex)
    });
});



const subscriptions = [];
onBeforeMount(async () => {

    await loadItems();
    await loadLists();
    await loadUsers();
    subscriptions[0] = eventBus.on('modal-filter', onModalFilter);
    subscriptions[1] = eventBus.on('get-groups-from-admin', getGroups);
    subscriptions[2] = eventBus.on('item-added', loadItems);
    subscriptions[3] = eventBus.on('item-updated', addUpdatedItem);
    subscriptions[4] = eventBus.on('search-item', );
    document.body.dir = 'ltr';
});

async function loadUsers() {
    users.value = await userService.query();
}

async function loadLists() {
    lists.value = await listService.query({ admin: true });
}

async function loadItems() {
    items.value = await itemService.query();

}

async function addUpdatedItem() {
    await loadItems();
}


function getGroups() {
    const groups = items.value.map(item => item.group);
    eventBus.emit('get-groups', [...new Set(groups)]);

}

function onModalFilter(filter) {
    console.log('filter', filter);
    searchTerm.value = filter;
}



function setFilterBy(filter) {
    filterBy.value = filter;
 
}


function saveUser(userId) {
    const user = users.value.find(user => user._id === userId);
    console.log('saving', user);
    // userService.save(user);
}

function deleteUser(userId) {
    console.log('deleting', userId);
    // userService.remove(userId);
}

function selectItem(itemId) {
    const item = items.value.find(item => item._id === itemId);
    eventBus.emit('toggle-modal', { type: 'ModalAddItem', info: JSON.parse(JSON.stringify(item)) });
    // itemService.save(item);
}

async function removeItem(itemId) {
    const isConfirm = confirm('Are you sure you want to delete this item?');
    if (!isConfirm) return;  
    await itemService.remove(itemId);
    items.value = items.value.filter(item => item._id !== itemId);
    console.log('deleted', itemId);

}

function saveList(listId) {
    const list = lists.value.find(list => list._id === listId);
    console.log('saving', list);
    // listService.save(list);
}

function deleteList(listId) {
    console.log('deleting', listId);
    // listService.remove(listId);
}
function selectList(listId) {
    const list = lists.value.find(list => list._id === listId);
    eventBus.emit('toggle-modal', { type: 'ModalAddList', info: JSON.parse(JSON.stringify(list)) });
    // listService.save(list);
}

function getTranslation(key) {
    return i18Service.getTransItem(key);
}

function addUser() {
    eventBus.emit('toggle-modal', { type: 'ModalAddUser' })
}
function addItem() {
    // userService.add();
    eventBus.emit('toggle-modal', { type: 'ModalAddItem' })
    // console.log(eventBus);

}
function addList() {
    eventBus.emit('toggle-modal', { type: 'ModalAddList' })
    console.log(eventBus);

}


onBeforeUnmount(() => {
    subscriptions.forEach(sub => sub());
    subscriptions.length = 0;
});
</script>

<style scoped>
.admin-view {

    overflow-x: auto;

    align-self: self-start;
    height: 100%;
    width: 100%;
    background: aliceblue;

    &.items {
        height: fit-content;
    }

    details {

        overflow-x: auto;
        margin: 1rem;
        padding: 1rem;
        background: white;
        border: 1px solid #ccc;
        border-radius: 5px;

        table {
            margin-top: 2rem;
            width: 100%;
            border-collapse: collapse;

            th,
            td {
                border: 1px solid #ccc;
                padding: 0.5rem;
            }

            th {
                background: #f0f0f0;
            }

            td {
                text-align: center;
            }

            tr:nth-child(even) {
                background: #f0f0f0;
            }

            tr:hover {
                background: #f0f0f0;
            }
        }
    }
}

.admin-filter {

    gap: 1.5rem;

    .entity-filter {
        padding-inline: 0.5rem;
        grid-template-columns: 100px min-content;
        grid-auto-flow: column;
        gap: 1rem;
        align-items: center;
        font-size: larger;


        .secondary-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }

        .actions-container {
            gap: 1rem;

            button {
                padding: 0.5rem 1rem;


            }
        }
    }

    form {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: min-content auto;
        background: #f0f0f0;
        padding: 0.5rem;
        align-items: center;
        gap: 0.5rem;
        font-size: larger;

        input {
            padding: 0.5rem;
            border: none;
            border-radius: 5px;
            font-size: inherit;
        }

        button {
            padding: 0.5rem;
            font-size: inherit;

        }


    }
}

.create-btn {
    justify-content: end;

    button {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
}

.item {
    &.actions-container {
        gap: 1rem;
        place-content: center;


        button {
            padding: 0.5rem 1rem;
        }
    }
}
</style>