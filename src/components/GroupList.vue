<template>
    <details v-for=" label, idx in labelList" :key="label.name" :class="`list-details ${labelOrder[idx]}`">
        <summary>
            <div class="summary-container">
                <span>{{ $trans(labelOrder[idx]) }} <span class="counter">{{ getCount(labelOrder[idx]) }}</span></span>
                <button @click.stop="onMore(labelOrder[idx])" class="more-btn" v-html="$svg('more')">
                </button>
            </div>
        </summary>
        <ItemList :list="groupList[labelOrder[idx]]" :labelName="labelOrder[idx]" @selectItem="onSelect" />
        <textarea @input="handleLabelChange" rows="5" :data-groupname="labelOrder[idx]"
            :placeholder="`${$trans('add-notes')} ${$trans(labelOrder[idx])}...`"
            :value="labelList.find(l => l.name === labelOrder[idx]).userInput" @focus="$emit('toggleEdit')">
        </textarea>
    </details>
</template>

<script setup>
import ItemList from '@/components/ItemList.vue'
import { eventBus, showSuccessMsg } from '@/services/event-bus.service';


const props = defineProps(['labelList', 'groupList', 'labelOrder'])
const emit = defineEmits(['selectItem', 'toggleEdit', 'updateLabel'])

function handleLabelChange($event) {
    const userInput = $event.target.value
    const name = $event.target.dataset.groupname
    emit('updateLabel', { name, userInput })
}

function onMore(labelName) {
    eventBus.emit('toggle-modal', { type: 'ModalInfo', info: labelName })
}

function getCount(label) {
    const count = props.groupList[label]?.filter(item => item.isSelected).length
    return count ? `(${count})` : ''
}

function onSelect({ item, labelName }) {
   emit('selectItem', { labelName, itemId: item._id })
}


</script>

<style scoped>
.counter {
    font-size: 1.2rem;
    color: var(--bClr3);
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