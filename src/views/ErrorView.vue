<template>
   <section class="error-view grid ">
      <h1>404</h1>
      <p>Page not found</p>

      <RouterLink to="/">
         <button class="secondary-btn">Go back to Home</button>
      </RouterLink>
   </section>
</template>

<script setup></script>

<style scoped>
.error-view {
   place-items: center;
   color: var(--bClr4);
   font-size: 2rem;

}
.secondary-btn {
  padding: 0.5rem 1rem;
}
</style>