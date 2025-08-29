<template>
    <!-- {{ props.items }} -->
       <input type="text" list="list-items" 
       @input="$emit('update:modelValue', $event.target.value)"
            v-model="modalValue" placeholder="Select item">
        <button class="modal-btn modal-btn-primary" @click="$emit('addItem')">Add</button>

        <ul v-if="listToAdd.items.length" class="small-item-list">
            <li v-for="item in props.listToAdd.items" class="grid grid-dir-col">
                <span>{{ item.name }}</span>
                <button class="icon-svg" type="button" @click.stop="$emit('removeFromList',item._id)"
                    v-html="$svg('close')"></button>
            </li>
        </ul>
        <div v-else>
            <span>No items in list</span>
        </div>

        <datalist id="list-items">
            <div v-for="item in props.items" :key="item._id">
                <option v-if="!isItemInList(item.name)" :value="item.name"></option>
            </div>

        </datalist>
    
</template>

<script setup>
const props = defineProps(['listToAdd', 'items'])


function isItemInList(itemName) {
    const isItemInList = props.listToAdd.value?.items.find(item => item.name === itemName)
    return isItemInList ? true : false
}
</script>

<style scoped>
@import '@/assets/modal-forms.css';

/* Additional styles specific to ModalItemList */
.in-list {
    background-color: red;
}

.primary-btn {
    padding: 0.5rem;
    max-width: max-content;
}
</style>