<template>
    <section v-if="itemToAdd" :class="['add-item', isSeeThrow ? 'see' : '']">
        <button @click="modify" v-html="$svg(btnState)"></button>
        <h1>Add Item <small>(if its red, it must have a value)</small> </h1>
        <form ref="formRef" class="grid" @submit.prevent="addItem">

            <div class="form-group grid">
                <label for="name">Name</label>
                <input @input.trim="getItem" type="text" id="name" v-model="itemToAdd.name" required>

                <div class="translation grid">
                    <label for="name">Translation</label>
                    <input type="text" id="he" v-model="itemToAdd.translation.he.val"
                        :required="itemToAdd.translation.he.isRequired" placeholder="Hebrew">
                    <input type="text" id="en" v-model="itemToAdd.translation.en.val"
                        :required="itemToAdd.translation.en.isRequired" placeholder="English">
                    <input type="text" id="es" v-model="itemToAdd.translation.es.val"
                        :required="itemToAdd.translation.es.isRequired" placeholder="Espanol">
                </div>
            </div>

            <div class="form-group  grid">
                <label for="icon">Icon</label>
                <input type="text" id="icon" v-model="itemToAdd.icon">
            </div>

            <div class="form-group grid">
                <label for="group">Group <span v-if="itemToAdd.group" class="group-name">({{ itemToAdd.group }})</span></label>
                <select name="group" @change="updateGroup" :required="itemToAdd._id?false:true">
                    <option value="">Select Group</option>
                    <option v-for="(group, idx) in groups" :class="`${group === itemToAdd.group? 'green-txt':''}`" :key="idx">{{ group }}</option>
                </select>
            </div>

            <div class="form-group grid">
                <label for="readMoreURL">Read More URL</label>
                <input type="text" id="readMoreURL" v-model="itemToAdd.readMoreURL">
            </div>

            <div class="form-group grid">
                <label for="color">Color</label>
                <input type="text" id="color" v-model="itemToAdd.color">
            </div>

            <div class="form-group grid">
                <label for="isSelected">Is Selected</label>
                <input type="checkbox" id="isSelected" v-model="itemToAdd.isSelected">

            </div>

            <div class="actions-container grid grid-dir-col">
                <button class="primary-btn" @click.prevent="addItem">{{ itemToAdd._id ? 'Update' : 'Add' }}</button>
                <button class="secondary-btn" @click.prevent="resetForm">Reset</button>
            </div>



        </form>


    </section>

</template>
<script setup>

import { ref, onMounted, onBeforeMount, computed, onBeforeUnmount, watchEffect } from 'vue';
import { adminService } from '@/services/admin.service';
import { eventBus, showErrorMsg } from '@/services/event-bus.service';
import { itemService } from '@/services/item.service';
import { i18Service } from '@/services/i18n.service';

const props = defineProps(['info'])
const emit = defineEmits(['modifyModal', 'resetModal'])

// or get by id to update
const itemToAdd = ref(null)
const formRef = ref(null)
const isSeeThrow = ref(false)
const groups = ref([])
const subscriptions = []

onBeforeMount(() => {
    if (props.info) {
        loadItem()
    } else {
        itemToAdd.value = adminService.getEmptyItem()
    }

    subscriptions[1] = eventBus.on('get-groups', (g) => {
        groups.value = g
    })

    getGroups()
})
const btnState = computed(() => isSeeThrow.value ? 'expend' : 'mini')


function loadItem(){
    const emptyItem = adminService.getEmptyItem()
        const trans= i18Service.getTransItem(props.info.name)
        for (const key in trans) {
            emptyItem.translation[key].val = trans[key]
        }
       itemToAdd.group = props.info.group
       itemToAdd.value = { ...emptyItem, ...props.info }

}
function updateGroup(ev) {
    itemToAdd.value.group = ev.target.value
}
function getItem() {
    eventBus.emit('modal-filter', itemToAdd.value.name)
}

function modify() {
    isSeeThrow.value = !isSeeThrow.value
    emit('modifyModal', isSeeThrow.value ? 'mini' : '')
}

async function addItem() {
    const isFormValid = formRef.value.checkValidity()

    if (!isFormValid) {
        showErrorMsg('FormValidation')
        return
    }

    const itemToSave= JSON.parse(JSON.stringify(itemToAdd.value))

    await itemService.save(itemToSave)
    if (itemToAdd.value._id) {
        eventBus.emit('item-updated', itemToSave)
    } else {
        eventBus.emit('item-added')
    }

    resetForm()

    emit('resetModal')
}

function resetForm() {
    itemToAdd.value = null
    formRef.value.reset()
}

function getGroups() {
    eventBus.emit('get-groups-from-admin', 'groups')
}


onBeforeUnmount(() => {
    subscriptions.forEach(sub => sub())
    subscriptions.length = 0
    console.log('unmounted');
    
})
</script>

<style scoped>
form {
    background-color: var(--bClr1);
    padding: 1.5rem 1rem;
    border-radius: var(--br);


    .actions-container {
        justify-content: space-between;

        button {
            padding: 0.8rem 1.5rem;
            max-width: 10rem;

        }
    }


}

.form-group {
    display: grid;
    gap: 0.5rem;

    label {
        font-weight: bold;
        font-size: larger;
    }


    .translation {
        margin-inline-start: 1rem;
        gap: 0.5rem;
    }

    input,
    select {
        padding: 0.5rem;
        border-radius: var(--br);
        border: 1px solid var(--bClr2);
        font-size: larger;
    }

    .group-name {
        font-size: smaller;
        color: var(--bClr3);
        border-radius: var(--br);
    }
}


input,
select {

    &:valid {
        border: 1px solid green;
    }

    &:invalid {
        border: 1px solid red;
    }

    &:not(:placeholder-shown) {
        border: 1px solid green;
    }

    &:not(:placeholder-shown):invalid {
        border: 1px solid red;
    }

    &:focus {
        outline: transparent;
        background-color: var(--bClr1);

    }

}

option.green-txt {
    color: green;
    background-color: var(--bClr2);
}


.form-group:has(label[for="isSelected"]) {
    grid-auto-flow: column;
    grid-template-columns: 7rem min-content;
    align-items: center;


}


input[type="checkbox"] {
    height: 1.5rem;
    width: 1.5rem;
}
</style>
