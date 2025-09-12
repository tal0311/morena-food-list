<template>
  <section class="home-view">
    <header>
      <h1 class="home-page-title">Mrena's Food List</h1>
      <p>{{ getIcon }}</p>
    </header>

    <section class="welcome-section grid">

      <TheWelcome />

      <footer class="grid" @contextmenu.prevent="resetStorage">
        <RouterLink :to="`/user/${user._id}`" class="icon" v-html="$svg('account')"></RouterLink>
        <RouterLink v-if="isBtnDisplayed" to="/admin" class="icon admin-btn" v-html="$svg('admin')"></RouterLink>
      </footer>
      <section>
      </section>
    </section>

  </section>
</template>

<script setup>


import { computed } from 'vue'
import TheWelcome from '@/components/TheWelcome.vue'
import { useUserStore } from '@/stores/user-store';

const getIcon = computed(() => {
  const icons = ["✅", "🥬", "🥦", "🥒", "🥑", "🫒", "🍅", "🍄", "🍑", "🍌", "🍇", "☕", "🥛", "🥩", "🧀", "🥚", "🥝", "🍉", "🍎", "🥭", "🍍", "🍌", "🍋", "🍊", "🍒", "🍓", "🫐", "🫑", "🌽", "🍆", "🫒", "🍅"];
  return icons[Math.floor(Math.random() * icons.length)];
})

const user = computed(() => useUserStore().getUser)

function resetStorage() {
  localStorage.clear()
  location.reload()
}

const isBtnDisplayed = computed(() => {
if (!user.value) return false
  const admins =['admin', 'super-admin','super_user']
  return admins.includes(user.value.role)
})



</script>

<style scoped>
header {
  position: fixed;
  top: 1rem;
  width: 100%;
  text-align: center;
  left: 0;
  font-size: 2.5rem;
}

h1,
p {
  margin: 0;

}

h1 {
  font-size: 2.5rem;

}

section {
  display: grid;
  place-content: center;

}

.icon {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-content: center;
}

.icon svg {
  width: 100%;
  height: 100%;
}

footer {
  position: fixed;
  bottom: 3rem;
  left: 3rem;
  gap: 2rem;

  .admin-btn{
    background-color: crimson;
  }
}

.lang-modal {
  position: absolute;
  top: -250%;
  border: none;
  background: var(--bClr1);
  box-shadow: 0 0 1px 0 var(--clr7);
  border-radius: 0.5rem;
  gap: 1rem;
  padding-block: 0.5rem;
}

.lang-modal button {
  all: unset;
  padding-inline: 0.5rem;


}
</style>