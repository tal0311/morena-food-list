<template>
    <dialog ref="userMsgRef" :class="`user-msg ${msgType}`" @click="clickOutSide">
        <div class="msg-container">
            <span>{{ userMsg }}</span>
        </div>
        <button v-if="msgType === 'error'" class="error-btn" @click="onReport">Report</button>
    </dialog>
</template>

<script setup>
import { eventBus } from '@/services/event-bus.service';
import { ref, onBeforeMount } from 'vue'
import { useAppStore } from '@/stores/app-store';

const userMsgRef = ref(null)

const userMsg = ref('Hello User')
const msgType = ref('')

onBeforeMount(() => {
    eventBus.on('show-msg', ({ txt, type }) => {
        
        userMsg.value = txt
        msgType.value = type
        userMsgRef.value.showModal()
        alert(userMsg.value)

        // const delay = txt.length > 20 ? 3000 : 1000
        let delay=2000

        if (txt.length > 40) {
            delay = 4000
        } 
        if (txt.length > 60) {
            delay = 6000
        }
        setTimeout(() => {
            closeModal()
        }, delay)
    })
})

function closeModal() {
    userMsg.value = ''
    userMsgRef.value.close()
}

const appStore = useAppStore()
function onReport() {
    appStore.reportError()
    closeModal()

}


function clickOutSide(ev) {
    if (!ev.target.classList.contains('msg-container')) {
       closeModal()
    }
}
</script>

<style scoped>
.user-msg {
    font-size: x-large;
    text-align: center;
    border: none;
    padding: 0.8rem;
    background-color: var(--clr8);
    color: var(--bClr2);
    border-radius: var(--br);
}

.user-msg.error {
    background: #ffff;
    border: 1px solid var(--clr12);
    color: var(--clr12);

}

.user-msg.error .msg-container {
    margin-block-end: 1rem;
}

.user-msg::backdrop {
    background: none !important;
}
.error-btn{
    padding: 0.5rem 0.8rem;
}

</style>