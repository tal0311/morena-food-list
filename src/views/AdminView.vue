<template>
    <section v-if="users || items || lists || recipes" :class="['admin-view', filterBy]">

        <h1>Welcome Moran, You can update your data base from here</h1>
        <DashboardFilter :filterBy="filterBy" v-model="searchTerm" @setFilterBy="setFilterBy" />

        <EntityTable v-for="e in entities" :key="e.name" :filterBy="e.name" :open="isOpen(e.name)"
            :entity="e.entity" @create="() => createEntity(e.name)" @remove="(id) => removeEntity(e.name, id)"
            @select="id => selectEntity(e.name, id)" />
    </section>

    <section v-else>
        <AppLoader />
    </section>
</template>

<script setup>
import { computed, ref, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import AppLoader from '@/components/AppLoader.vue';
import { userService } from '@/services/user.service';
import { itemService } from '@/services/item.service';
import { listService } from '@/services/list.service';
import { i18Service } from '@/services/i18n.service';
import { eventBus, showSuccessMsg, showUserMsg } from '@/services/event-bus.service';
import { recipeService } from '@/services/recipe.service.local';
import DashboardFilter from '@/components/dashboardCmps/DashboardFilter.vue';
import EntityTable from '@/components/dashboardCmps/EntityTable.vue';



const users = ref(null);
const items = ref(null);
const lists = ref(null);
const recipes = ref(null);

const searchTerm = ref('');
const filterBy = ref('');

const filteredUsers = computed(() => {
    return users.value?.filter(user => {
        const regex = new RegExp(searchTerm.value, 'i');
        return user.username.match(regex) || user.email.match(regex)
    });
});


function isOpen(entity) {
    return filterBy.value === entity;
}
const filteredRecipes = computed(() => {
    return recipes.value?.filter(recipe => {
        const regex = new RegExp(searchTerm.value, 'i');
        return recipe.en.title.match(regex) || recipe.en.description.match(regex) ||
            recipe.he.title.match(regex) || recipe.he.description.match(regex);
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

const entities = [{
    name: 'user',
    entity: filteredUsers

}
    , {
    name: 'item',
    entity: filteredItems
},
{
    name: 'list',
    entity: filteredLists
},
{
    name: 'recipe',
    entity: filteredRecipes
}];




const subscriptions = [];
onBeforeMount(async () => {

    await loadItems();
    await loadLists();
    await loadUsers();
    await loadRecipes();

    // TODO: consider removing listeners for update if proxy is used
    // addListeners();
    subscriptions[0] = eventBus.on('modal-filter', onModalFilter);
    subscriptions[1] = eventBus.on('get-groups-from-admin', getGroups);
    subscriptions[2] = eventBus.on('item-added', loadItems);
    subscriptions[3] = eventBus.on('item-updated', updateItem);
    subscriptions[4] = eventBus.on('list-added', loadLists);
    subscriptions[5] = eventBus.on('user-updated', loadUsers);
    subscriptions[6] = eventBus.on('user-added', loadUsers);
    subscriptions[7] = eventBus.on('recipe-added', loadRecipes);
    // subscriptions[8] = eventBus.on('recipe-updated', updateRecipe);
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

async function loadRecipes() {
    recipes.value = await recipeService.query({ admin: true });
}

function createEntity(entity) {
    let modalTYpe = null
    switch (entity) {
        case 'user':
            modalTYpe = 'ModalAddUser'
            break;
        case 'item':
            modalTYpe = 'ModalAddItem'
            break;
        case 'list':
            modalTYpe = 'ModalAddList'
            break;
        case 'recipe':
            // showSuccessMsg('comingSoon');
            modalTYpe = 'ModalAddRecipe'
            
            break;
    }
    eventBus.emit('toggle-modal', { type: modalTYpe });
}

function removeEntity(entity, id) {
    console.log('removing', entity, id);

    const isConfirm = confirm(`Are you sure you want to delete this ${entity}?`);
    if (!isConfirm) return;
    switch (entity) {
        case 'user':

            users.value = users.value.filter(user => user._id !== id);
            userService.remove(id);

            break;
        case 'item':

            items.value = items.value.filter(item => item._id !== id);
            itemService.remove(id);
            break;
        case 'list':

            lists.value = lists.value.filter(list => list._id !== id);
            listService.remove(id);
            break;
        case 'recipe':
            recipes.value = recipes.value.filter(recipe => recipe._id !== id);
            recipeService.remove(id);
            break;
    }
}

function selectEntity(entity, id) {
    console.log('selecting', entity, id);
    
    
    const modalData = { type: '', info: {} }
    switch (entity) {
        case 'user':
            modalData.type = 'ModalAddUser';
            modalData.info = users.value.find(user => user._id === id);

            break;
        case 'item':
            modalData.type = 'ModalAddItem';
            modalData.info = items.value.find(item => item._id === id);
            break;
        case 'list':
            modalData.type = 'ModalAddList';
            modalData.info = lists.value.find(list => list._id === id);
            break;
        case 'recipe':
            modalData.type = 'ModalAddRecipe';
            modalData.info = recipes.value.find(recipe => recipe._id === id);
            break;
    }
    eventBus.emit('toggle-modal', modalData);
}


function getGroups() {
    const groups = items.value.map(item => item.group);
    eventBus.emit('get-groups', [...new Set(groups)]);

}

function onModalFilter(filter) {
    console.log('onModalFilter', filter);
    
    searchTerm.value = filter;
}

function setFilterBy(filter) {
    filterBy.value = filter;

}

function updateRecipe(recipe) {
    recipes.value = recipes.value.map(r => r._id === recipe._id ? recipe : r);
}

function updateItem(item) {
    items.value = items.value.map(i => i._id === item._id ? item : i);

}

function getTranslation(key) {
    return i18Service.getTransItem(key);
}



onBeforeUnmount(() => {
    subscriptions.forEach(sub => sub());
    subscriptions.length = 0;
});
</script>

<style scoped>
.admin-view {

    h1{
        padding-inline: 0.5rem;
    }
    overflow-x: auto;

    align-self: self-start;
    height: 100%;
    width: 100%;
    background: var(--bClr1);

    &.items {
        height: fit-content;
    }

  
}

</style>