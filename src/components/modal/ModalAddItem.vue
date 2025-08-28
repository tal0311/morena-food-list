<template>
    <section v-if="itemToAdd" class="dashboard-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Item <small>(if its red, it must have a value)</small></h2>
            </div>
            
            <form ref="formRef" class="modal-form" @submit.prevent="addItem">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input @input.trim="getItem" type="text" id="name" v-model="itemToAdd.name" required>
                </div>

                <div class="search-results" v-if="search.length > 0&& itemToAdd.name">
                    <span v-for="item in search" :key="item" @click="itemToAdd.name = item.name">{{ item.name }} {{ item.icon }},</span>
                </div>
                <div class="search-results" v-else>
                    <span>Products you already have will be shown here</span>
                </div>

                <div class="form-group">
                    <label for="translation">Translation</label>
                    <div class="modal-grid modal-grid-3">
                        <input type="text" id="he" v-model="itemToAdd.translation.he.val"
                            :required="itemToAdd.translation.he.isRequired" placeholder="Hebrew">
                        <input type="text" id="en" v-model="itemToAdd.translation.en.val"
                            :required="itemToAdd.translation.en.isRequired" placeholder="English">
                        <input type="text" id="es" v-model="itemToAdd.translation.es.val"
                            :required="itemToAdd.translation.es.isRequired" placeholder="Espanol">
                    </div>
                </div>

                <div class="form-group">
                    <label for="icon">Icon</label>
                    <input type="text" id="icon" v-model="itemToAdd.icon">
                </div>

                <div class="form-group">
                    <label for="group">Group <span v-if="itemToAdd.group" class="group-name">({{ itemToAdd.group }})</span></label>
                    <select name="group" id="group" @change="updateGroup" :required="itemToAdd._id?false:true">
                        <option value="">Select Group</option>
                        <option v-for="(group, idx) in groups" :class="`${group === itemToAdd.group? 'green-txt':''}`" :key="idx">{{ group }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="readMoreURL">Read More URL</label>
                    <input type="text" id="readMoreURL" v-model="itemToAdd.readMoreURL">
                </div>

                <div class="form-group">
                    <label for="color">Color</label>
                    <input type="text" id="color" v-model="itemToAdd.color">
                </div>

                <div class="form-group">
                    <label for="isSelected">Is Selected</label>
                    <input type="checkbox" id="isSelected" v-model="itemToAdd.isSelected">
                </div>
            </form>
            
            <div class="modal-actions">
                <button class="modal-btn modal-btn-secondary" @click="resetForm">Reset</button>
                <button class="modal-btn modal-btn-primary" @click="addItem">{{ itemToAdd._id ? 'Update' : 'Add' }}</button>
            </div>
        </div>
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

const items = ref(null);


onBeforeMount(async() => {
    if (props.info) {
        loadItem()
    } else {
        items.value = await itemService.query()
        itemToAdd.value = adminService.getEmptyItem()
    }

    subscriptions[1] = eventBus.on('get-groups', (g) => {
        groups.value = g
    })

    getGroups()
})


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


const search = computed(() => {
    return items.value.filter(item => item.name.includes(itemToAdd.value.name)).map(item => ({name: item.name, icon: item.icon }))
})

async function addItem() {
    const isFormValid = formRef.value.checkValidity()
    if(search.value.length > 0){
        const confirmation = confirm('This product already exists, do you want to add it anyway?')
        if(!confirmation){
            return
        }
    }

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
    itemToAdd.value = adminService.getEmptyItem()
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
@import '@/assets/modal-forms.css';

.search-results {
    height: 100px;
    overflow-y: auto;
    font-size: 1.1rem;
    color: var(--txtClr2);
    border-radius: var(--br);
    background-color: var(--bClr2);
    border: 1px solid var(--bClr3);
    border-radius: var(--br);
    padding: 0.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
}
</style>
