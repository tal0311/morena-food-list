<template>
    <!-- {{ props.items }} -->
       <input type="text" class="items-input" list="list-items" 
       @input="$emit('update:modelValue', $event.target.value)"
            v-model="modalValue" placeholder="Select item">
        <button class="primary-btn" @click="$emit('addItem')">Add</button>

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
.in-list {
    background-color: red;
}
.primary-btn {
    padding: 0.5rem;
    max-width: max-content;
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

</style>