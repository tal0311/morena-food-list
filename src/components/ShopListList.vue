<template>
        <ul v-if="props.lists" class="history-list clean-list grid" >
         
            <li v-for="list in props.lists" :key="list._id" class="list-preview grid">
                <small> נוצר בתאריך: {{ formatDate(list.createdAt) }}</small>
                <small>{{ list.title }}</small>
               
            <!-- <span class="secondary-btn" >display</span> -->

            <details ref="detailsRef">
                <summary @click="onSelectList($event, list._id)" class="item-summary grid"> 
                    {{ $trans('show-items') }} <small class="counter">({{ list.items.length }})</small>
                </summary>
               <ul v-if="props.currList && list._id === props.currList._id">
                <li v-for="item in props.currList.items" :key="item._id">{{ $trans(item.name) }}</li>
               </ul>
              
            </details>
            <RouterLink :to="`/list/${list._id}`">
                    <span class="primary-btn">{{ $trans('restore') }}</span>
            </RouterLink>

            </li>
        </ul>
        <p v-else>{{ $trans('no-history') }}</p>
</template>

<script setup>
import { ref, onBeforeMount, watchEffect } from 'vue';

const props = defineProps({
    lists: {
        type: Object,
        required: true
    },
    currList: {
        type: Object,
    
    }
})

const detailsRef = ref(null)
const emit = defineEmits(['selectList'])

function onSelectList($event, listId) {
    
 if(props.currList && listId === props.currList._id) {
        $event.target.open = false
        return
 }
detailsRef.value.forEach(detail => {
    detail.open = false
})
emit('selectList', listId)
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('he-IL');
};
</script>

<style scoped>


.list-preview{
        border: 1px solid var(--clr4);
        padding: 0.5em;
        gap: 0.5em;
        .primary-btn{
          background-color: var(--bClr5);
          outline: 1px solid var(--bClr5);
            /* display: block; */
            font-size: 1rem;
            border-radius: revert;
            padding: 0.2em;
        }

        small:first-of-type{
            font-size: 0.8rem;
        }

        .item-summary{
            justify-content: space-between;
                }
        
 }
details {
    font-size: 1rem;
    width: 100%;
    box-shadow: 0 0 2px 0px var(--clr4);
    /* outline: 1px solid #c9c9c9; */
    border-radius: 2px;
    padding: 0.5em 0.5em 0;

    summary {
        display: grid;
        grid-auto-flow: column;
        position: relative;
        margin: -0.5em -0.5em 0;
        padding: 0.2em;
        color: var(--clr7);
        text-transform: capitalize;
        cursor: pointer;
        /* grid-template-columns: 1fr 20px; */




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


details>summary {

    list-style: none;

    .counter {
        color: var(--bClr3);
    }
}

summary::-webkit-details-marker {
    display: none
}
</style>