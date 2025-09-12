<template>
    <header v-if="!excludedRoutes.includes(router.currentRoute.value.name)" class="main-header main-layout">
        <nav class="grid app-nav grid-dir-cols">
          <RouterLink :to="{path: `/user/${ props.user._id }`, meta: { userId: props.user._id }}">
            <UserPreview :user="props.user" display="app-nav" />
          </RouterLink>
          <RouterLink to="/">
            <img src="/android-chrome-512x512.png" alt="Logo" class="logo">
          </RouterLink>
          <!-- <img src="/android-chrome-512x512.png" alt="Logo" class="logo"> -->
        </nav>
      </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import UserPreview from '@/components/UserPreview.vue';

const router = useRouter();
const props = defineProps({
    user: {
        type: Object,
      }
})

const excludedRoutes = ['home', 'login', 'user', 'admin'];
</script>

<style scoped>
.main-header {
  position:fixed;
  top: 0;
  width: 100vw;
  /* text-align: center; */
  z-index: 9999;
  background-color: var(--bClr2);
  padding-block: 0.5rem;
  /* place-content: end; */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);

  .app-nav{
    grid-template-columns: 1fr 1fr;
    >*:first-child{
      justify-self: start;
    }
    >*:last-child{
      justify-self: end;
    }

    width: 100%;
  }
  .logo{
      width: 30px;
      border: 1px solid #adadad;
    border-radius: 50%;
    
    }
}
</style>
