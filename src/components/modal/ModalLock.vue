<template>
    <section class="lock-screen-modal">
        <div v-html="$svg('unlock')" @click="isMsgDisplayed=true" @contextmenu.prevent="closeModal"></div>
        <small v-if="isMsgDisplayed" class="prevent-select">Long press to unlock</small>
    </section>
</template>

<script setup>
import { eventBus } from '@/services/event-bus.service';
import { ref, watchEffect } from 'vue';

const emit = defineEmits(['resetModal'])

const isMsgDisplayed =ref(false)

watchEffect(()=>{
    if(isMsgDisplayed.value){
        setTimeout(()=>{
            isMsgDisplayed.value =false
        },2000)
    }
})

function closeModal() {
    eventBus.emit('display-footer')
    emit('resetModal')
}
</script>

<style scoped>
.lock-screen-modal {

    small{
        background-color: var(--bClr2);
        padding-inline: 0.5rem;
    }
   text-align: center;
   border-radius: var(--br);
}
</style>