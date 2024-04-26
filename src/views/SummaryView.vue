<template>
    <section class="summary-view">
        <h1>Summary</h1>
        <p>Here is a summary of your list:</p>
        <!-- <pre>{{ selectItems }}</pre> -->
        <ItemList v-if="selectItems.length" :list="selectItems" is="summary" />
        <section v-else class="no-items grid">
            <h2>No items for display, check them in you list</h2>
        </section>

        <div class="summary-charts">
            <h2>Summary Charts</h2>
            <DashBoard />
            <p>Here are some charts to help you understand your list better</p>
        </div>

        <footer>
            <button @click="$router.push({ name: 'list' })">Back</button>
        </footer>


    </section>
</template>

<script setup>
import { ref, onBeforeMount, computed, watchEffect, watch } from 'vue'
import { useListStore } from '@/stores/list-store';
import ItemList from '@/components/ItemList.vue'
import DashBoard from '@/components/DashBoard.vue'

const listStore = useListStore()

const selectItems = computed(() => listStore.getSelectedItems)

</script>

<style scoped>
.summary-view {

    position: fixed;
    width: 80vw;

    background-color: white;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow-y: auto;
    height: 90vh;


}
</style>