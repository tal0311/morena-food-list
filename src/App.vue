<template>
  <section class="main-app main-layout">
    <RouterView />
    <UserMsg />

  </section>
</template>

<script setup>
//TODO: canva info ang img

import { computed, watchEffect } from 'vue';
import UserMsg from '@/components/UserMsg.vue'
import { useUserStore } from './stores/user-store';
import { useListStore } from './stores/list-store';
import { useRouter } from 'vue-router';

const listStore = useListStore();
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const router = useRouter();

watchEffect(() => {
  if (user.value) {
    loadData()
  } else {
    router.push('/login')
  }
})

async function loadData() {
  await userStore.loadUser();
  await listStore.loadLists()
}
</script>

<style scoped>
.main-app {
  height: 100dvh;

}
</style>
