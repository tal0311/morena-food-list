<template>
    <div class="debug-container">
        <h1>User</h1>
       <pre>{{ userStore.loggedUser }}</pre>
       <hr>
        <h1>App</h1>
        <pre>{{ appStore.errorLogs }}</pre>
        <hr>
        <h1>List</h1>
        <hr>
        <pre>{{ listStore.list}}</pre>
        <pre>{{ listStore.getLabels}}</pre>
    </div>
</template>

<script setup>
import { useListStore } from '@/stores/list-store';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { ref, onMounted, onBeforeMount, watchEffect, computed } from 'vue';

const listStore = useListStore();
const appStore = useAppStore();
const userStore = useUserStore();

onMounted(() => {
    // console.log('mounted', listStore.getList);
    
})
</script>
