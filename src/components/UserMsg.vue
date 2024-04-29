<template>
    <dialog ref="userMsgRef" class="user-msg">
        <div class="msg-container">
        <span>{{ userMsg }}</span>
        </div>
    </dialog>
</template>

<script setup>
import { eventBus } from '@/services/event-bus.service';
import { ref ,watchEffect, onMounted, onBeforeMount } from 'vue'

const userMsgRef = ref(null)

const userMsg = ref('Hello User')

onBeforeMount(()=>{
    eventBus.on('show-msg', (msg)=>{
        userMsg.value = msg
        userMsgRef.value.showModal()

        setTimeout(()=>{
            userMsgRef.value.close()
            userMsg.value = ''
        },2000)
    })
})
</script>

<style scoped>
.user-msg{
    border: none;
    padding: 0.8rem;
    background-color: var(--clr8);
    color: var(--bClr2);
    border-radius: var(--br);
   

}

.user-msg::backdrop{
        background: none;
}
</style>