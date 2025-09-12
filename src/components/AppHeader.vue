<template>
    <header v-if="!excludedRoutes.includes(router.currentRoute.value.name)" class="main-header main-layout">
        <nav class="grid app-nav grid-dir-cols">
          <RouterLink :to="{path: `/user/${ props.user._id }`, meta: { userId: props.user._id }}">
            <UserPreview :user="props.user" display="app-nav" />
          </RouterLink>
          <input  name="search" :class="searchVisible?'':'hidden'" type="text" v-model="search" :placeholder="$trans('search')" />
          <RouterLink to="/">
            <img src="/android-chrome-512x512.png" alt="Logo" class="logo">
          </RouterLink>
          <!-- <img src="/android-chrome-512x512.png" alt="Logo" class="logo"> -->
        </nav>
      </header>
</template>

<script setup>
import { ref, watchEffect , computed } from 'vue';
import { useRouter , useRoute } from 'vue-router';
import UserPreview from '@/components/UserPreview.vue';
import { useGlobals } from '@/composables/useGlobals';

const { $trans } = useGlobals()
const router = useRouter()
const route = useRoute()

const search = ref('')

const searchVisible = computed(() => {
  return router.currentRoute.value.name === 'list'
})


const props = defineProps({
    user: {
        type: Object,
      }
})
  
watchEffect(() => {
  if(searchVisible.value){
    router.push({ name: route.name, query: { search: search.value } })

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
    align-items: center;
    input{
      padding: 0.5rem;
      width: 100%;
      border: 1px solid var(--bClr4);
      &.hidden{
        opacity: 0;
      }
    }
    grid-template-columns: 1fr auto 1fr;
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
      border: 1px solid var(--bClr4);
    border-radius: 50%;
    
    }
}
</style>
