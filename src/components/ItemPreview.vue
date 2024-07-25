<template>
    <!-- <pre></pre> -->
    <section :class="`item-preview grid ${isSwiped ? 'swiped' : 'disabled'} ${sharedItem && 'shared'} `">
        <input v-if="isSwiped" type="checkbox" :id="item._id" :checked="props.item.isSelected && isSwiped"
            @change="onSelect">
        <div @click="isSwiped = !isSwiped" class="item-info grid grid-dir-col">
            <span>{{ $trans(props.item.name) }}</span>
            <span>{{ props.item.icon }}</span>
        </div>
        <span class="icon-svg" @click.stop="itemInfo" v-html="$svg('help')"></span>

    </section>
</template>

<script setup>

import { useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import { showSuccessMsg } from '@/services/event-bus.service';
import { useListStore } from '@/stores/list-store';


const props = defineProps({
    item: Object,
    idx: Number,
    labelName: String,
    display: {
        type: String,
        default: 'list-items'

    }
})

const emit = defineEmits(['selectItem', 'shearSelectItem'])

const isSwiped = ref(false)

const route = useRoute()

const listStore = useListStore()

function onSelect() {
    console.log('selecting item', props.item);
    emit('selectItem', { item: props.item, labelName: props.labelName })
}



const sharedItem = ref(false)

watchEffect(() => {
    if (props.item.isSelected) {
        isSwiped.value = true
    }
    if (props.item.isShared) {
        sharedItem.value = true
    }
})

function isItemShared() {


}

function itemInfo() {
    showSuccessMsg('comingSoon')
}


</script>

<style scoped>
.item-preview {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    grid-auto-flow: column;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
    /* align-items: baseline; */
    cursor: pointer;
    padding: 0.5rem;
    box-shadow: 0 0 1px 1px lightgray;

    span:last-child {
        justify-self: end;
    }

    &.shared input[type="checkbox"] {
        accent-color: var(--bClr5);
    }

    &.swiped {
        grid-template-columns: 40px 1fr 40px;
    }

    .item-info {
        grid-template-columns: repeat(2, fit-content);
        gap: 1rem
    }
}

.label-container {
    /* font-size: 1.5rem; */
    grid-auto-flow: column;
    grid-template-columns: 20px 50%;
    align-items: center;
    gap: 1rem;
}

input[type="checkbox"] {
    padding: 1rem;
    accent-color: var(--bClr3);
}


.disabled {
    opacity: 0.5;
}
</style>