<template>
    <details v-for="{ name, userInput }, idx in labelList" :key="name" :class="`list-details ${name}`">
        <summary :class="[itemsMap[name] ? 'has-items' : '']">

            <div class="summary-container">
                <span>{{ $trans(name) }} <span class="counter">{{ itemsMap[name] ? `(${itemsMap[name]})` : ''
                        }}</span></span>
                <button @click.stop="onMore(name)" class="more-btn" v-html="$svg('more')">
                </button>
            </div>


        </summary>
        <ItemList :list="groupList[name]" :labelName="name" @selectItem="onSelect" />

        <textarea @input="handleLabelChange" rows="5" :data-groupname="name" placeholder="Add your notes here..."
            :value="userInput" @focus="$emit('toggleEdit')"></textarea>
    </details>
</template>

<script setup>
import ItemList from '@/components/ItemList.vue'
import { eventBus, showSuccessMsg } from '@/services/event-bus.service';
import { ref } from 'vue';

const props = defineProps(['labelList', 'groupList'])
const emit = defineEmits(['selectItem', 'toggleEdit', 'updateLabel'])

function handleLabelChange($event) {
    // emit('toggleEdit', name)
    const userInput = $event.target.value
    const name = $event.target.dataset.groupname
    emit('updateLabel', { name, userInput })
}

function onMore(labelName) {

    eventBus.emit('toggle-modal', { type: 'ModalInfo', info: labelName })
}

const itemsMap = ref({})

function onSelect({ item, labelName, isShared }) {

    if (!item.isSelected) {
        itemsMap.value[labelName] = itemsMap.value[labelName] ? itemsMap.value[labelName] + 1 : 1
    } else if (item.isSelected && isShared) {
        itemsMap.value[labelName] = itemsMap.value[labelName] ? itemsMap.value[labelName] + 1 : 1

    } else {
        itemsMap.value[labelName] = itemsMap.value[labelName] ? itemsMap.value[labelName] - 1 : 0
    }

    if (!isShared) {
        emit('selectItem', item._id)
    }
}

</script>

<style scoped>
.counter {
    font-size: 1.2rem;
    color: var(--clr7);
    margin-left: 0.5rem;
    text-decoration: none;
}

details {
    box-shadow: 0 0 2px 0px var(--clr4);
    /* outline: 1px solid #c9c9c9; */
    border-radius: 2px;
    padding: 0.5em 0.5em 0;

    summary {
        display: grid;
        align-items: center;
        position: relative;
        font-weight: bold;
        margin: -0.5em -0.5em 0;
        padding: 0.5em;
        color: var(--clr7);
        text-transform: capitalize;
        font-size: 1.5rem;
        cursor: pointer;

        &::marker {
            color: var(--clr7);

            /* content:'' */
        }

        &.has-items .counter {
            color: var(--bClr3);
        }

    }

    &[open] {
        padding: 0.5em;
    }

    &[open] summary {
        /* box-shadow: 0 0 2px 0px #c9c9c9; */
        margin-bottom: 0.5em;
    }


}


.summary-container {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    width: 100%;
    /* justify-content: space-between; */
    gap: 1rem;
}

.more-btn {
    all: unset;
    display: grid;
    place-content: center;
}

textarea {
    margin-block: 1rem;
    outline: 1px solid var(--bClr1);
    resize: none;
    width: 100%;
    border: none;
    padding: 0.3rem;
    font-family: inherit;
    font-size: 1.5rem;
}
</style>