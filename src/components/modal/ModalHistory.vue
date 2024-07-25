<template>
    <section class="history-modal grid ">
        <button class="primary-btn" @click="onSelectHistory">{{ $trans('hm-action1') }}</button>
        <RouterLink to="/user">
            <button class="primary-btn">{{ $trans('hm-action2') }}</button>
        </RouterLink>
    </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { eventBus, showSuccessMsg } from '@/services/event-bus.service';

const emit = defineEmits(['resetModal'])

const route = useRoute()
const router = useRouter()
function onSelectHistory() {

    const { history } = route.query
    if (history) {
        const query = {}
        for (const key in route.query) {
            if (key !== 'history') {
                query[key] = route.query[key]
            }

        }

        closeModal()
        router.push({ name: 'list', query })
        // eventBus.emit('restore-history')
        showSuccessMsg('restoreHistory')

    }
}

function closeModal() {
    emit('resetModal')
}

</script>

<style scoped>
.history-modal {
    background-color: var(--bClr1);
    padding: 2rem 1rem;
    gap: 1rem;
    width: 100%;
}

button {
    padding: 1rem;
    width: 100%;
}
</style>