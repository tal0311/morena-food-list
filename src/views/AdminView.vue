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
                        <th>Id</th>
                        <th>Name</th>
                        <th>Group</th>
                        <th>color</th>
                        <th>Read More At</th>
                        <th>Icon</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredItems" :key="item._id" :class="`item-${item._id}`">
                        <td>{{ item._id }}</td>
                        <td>
                            <span contenteditable @blur="saveItem('name', item._id, $event)">{{ item.name }}</span>
                            / {{ getTranslation(item.name) }}
                        </td>
                        <td contenteditable @blur="saveItem('group', item._id, $event)">
                            <span>
                                {{ item.group }}
                            </span>
                            /

                            {{ getTranslation(item.group) }}
                        </td>
                        <td contenteditable @blur="saveItem('color', item._id, $event)">
                            {{ item.color }}
                        </td>
                        <td contenteditable @blur="saveItem('readMoreURL', item._id, $event)">
                            {{ item.readMoreURL || 'No Read More Url' }}
                        </td>
                        <td contenteditable>{{ item.icon }}</td>
                        <td>
                            <button @click="deleteItem(item._id)">Delete</button>
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
                        <th>Id</th>
                        <th>Title</th>
                        <th>Items</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="list in filteredLists" :key="list._id">
                        <td contenteditable>{{ list._id }}</td>
                        <td contenteditable>{{ list.title }}</td>
                        <td contenteditable>{{ list.items.map(item => item.name) }}</td>
                        <td contenteditable>{{ list.owner.username }}</td>
                        <td>
                            <button @click="deleteList(list.id)">Delete</button>
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
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue';
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
    console.log('AdminView is mounted',);
    users.value = await userService.query();
    items.value = await itemService.query();
    lists.value = await listService.query({ admin: true });
    subscriptions[0] = eventBus.on('modal-filter', onModalFilter);
    subscriptions[1] = eventBus.on('get-groups-from-admin', getGroups);

    document.body.dir = 'ltr';
});

function getGroups() {
    const groups = items.value.map(item => item.group);
    eventBus.emit('get-groups', groups);

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

function saveItem(key, itemId, event) {
    console.log('saving', key, event.target.innerText);
    const item = items.value.find(item => item._id === itemId);
    // itemService.save(item);

    item[key] = event.target.innerText;
    console.log('saving', item);
}

function deleteItem(itemId) {
    console.log('deleting', itemId);
    // itemService.remove(itemId);
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

function getTranslation(key) {
    return i18Service.getTransItem(key);
}

function addUser() {
    eventBus.emit('toggle-modal', { type: 'ModalAddUser' });
}
function addItem() {
    console.log('adding user');
    // userService.add();
    eventBus.emit('toggle-modal', { type: 'ModalAddItem' });
    // console.log(eventBus);

}
function addList() {
    console.log('adding user');
    // userService.add();
    eventBus.emit('toggle-modal', { type: 'ModalAddList' });
    console.log(eventBus);

}

onBeforeUnmount(() => {
    subscriptions.forEach(sub => sub());
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
</style>