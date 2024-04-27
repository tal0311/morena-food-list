
<template>
 <section>
  <h1>{{$trans('home-page')}}</h1>

  <div class="action-container">
    <button @click="onTakeTour">{{ $trans('home-action-1') }}</button>
    <button to="/register">
      <RouterLink to="/list">{{ $trans('home-action-2') }}</RouterLink>
    </button>
  </div>
 </section>
</template>

  <script setup>
  
  import { useRouter } from 'vue-router'
  const router = useRouter()

  const onTakeTour = () => {
    router.push('/list?tour=true')
  }
  </script>

  <style scoped></style>