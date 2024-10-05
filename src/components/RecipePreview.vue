<template>
    <section>
        <article class="recipe-preview grid" @click="isOpen = !isOpen">
            <img :src="props.recipe.imgUrl" :alt="props.recipe.title">


            <div class="info-container grid">
                <h4>{{ props.recipe.title }}</h4>

            </div>
        </article>
        <Transition>

            <section class="description-container" v-if="isOpen">
                <ul>
                    <li v-for="item in descriptionAsList">{{ item }}.</li>
                </ul>
            </section>
        </Transition>
    </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    recipe: {
        type: Object
    }

})

const isOpen = ref(false)

const descriptionAsList = computed(() => {
    return props.recipe.description.split('.').filter(item => item)
})

</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.recipe-preview {
    overflow: hidden;
    box-shadow: 0 0 2px 0px var(--clr4);
    height: 500px;
    position: relative;
    border-radius: var(--br);
    overflow: hidden;
    color: #fff;

    grid-template-columns: 20px 1fr 20px;
    grid-template-rows: 40px 1fr 40px 40px;
    
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.601) 0%, rgba(47, 47, 47, 0.327) 30%, rgba(64, 64, 64, 0.099) 100%);

    .info-container {
        grid-column: 2;
        grid-row: 3;

        h4 {
            font-size: 1.2rem;
            margin: 0;

        }

    }
}
.description-container{
    max-width: 550px;
}

img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}
</style>