<template>
    <dialog ref="userMsgRef" :class="`user-msg ${msgType}`">
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

        const delay = type === 'error' ? 5000 : 1000
        console.log('show-msg', txt, type);
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
    console.log('onReport');
    appStore.reportError()
    closeModal()

}
</script>

<style scoped>
.user-msg {
    border: none;
    padding: 0.8rem;
    background-color: var(--clr8);
    color: var(--bClr2);
    border-radius: var(--br);
}

.user-msg.error {
    text-align: center;
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
</style>