<template>
    <!-- <pre></pre> -->
    <section :class="`item-preview grid ${isSwiped ? 'swiped' : 'disabled'} ${sharedItem && 'shared'} ${display}`">
        <input v-if="isSwiped" type="checkbox" :id="item._id" :checked="isItemChecked" @change="onSelect">
        <div @click="isSwiped = !isSwiped" class="item-info grid grid-dir-col">
            <span>{{ $trans(props.item.name) }}</span>
            <span v-if="props.item.icon">{{ props.item.icon }}</span>
            <span v-else v-html="$svg('default_icon')"></span>
        </div>
        <span class="icon-svg" @click.stop="itemInfo" v-html="$svg('help')"></span>

    </section>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { showSuccessMsg } from '@/services/event-bus.service';
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

function onSelect() {
    if (props.display === 'shopping-list') return
    emit('selectItem', { item: props.item, labelName: props.labelName })
}

const isItemChecked = computed(() => {
    if (props.item.isSelected && isSwiped.value && props.display !== 'shopping-list') {
        return true
    }
})



const sharedItem = ref(false)

watchEffect(() => {
    if (props.item.isSelected) {
        isSwiped.value = true
    }
    if (props.item.isShared) {
        sharedItem.value = true
    }
})

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
    grid-template-columns: 2fr 1fr;
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
        grid-template-columns: max-content 1fr;
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