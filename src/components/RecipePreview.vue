<template>
    <section>


        <!-- {{ props.recipe.title }} -->

        <article class="recipe-preview grid" @click="isOpen = !isOpen">
            <img :src="props.recipe.imgUrl" :alt="props.recipe.title">
            
            
            <div class="info-container grid">
                <h4>{{ props.recipe.title }}</h4>
                <div class="sub-info grid">
                    <span>{{ props.recipe.title }} </span> <span>{{ props.recipe.group }}</span>
                </div>
            </div>
        </article>

        <section v-if="isOpen">

           <p>{{ props.recipe.description }}</p>

        </section>


    </section>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
    recipe: {
        type: Object   
    }
   
})

const isOpen = ref(false)

</script>

<style scoped>
.recipe-preview {


    /* padding: 2rem; */
    box-shadow: 0 0 2px 0px var(--clr4);

    width: 90vw;
    height: 500px;
    position: relative;
    border-radius: var(--br);
    overflow: hidden;
    color: #fff;

    display: grid;
    grid-template-columns: 0.2fr 1.8fr 0.2fr;
    grid-template-rows: 20px 0.6fr 2.1fr 1.5fr 20px;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
        ". . ."
        ". match ."
        ". . ."
        ". info ."
        ". . .";

    align-items: center;

    background: linear-gradient(0deg, rgba(0, 0, 0, 0.601) 0%, rgba(47, 47, 47, 0.327) 30%, rgba(64, 64, 64, 0.099) 100%);
}

.match {
    grid-area: match;
    border: none;
    padding: 0.5rem;
    background-color: #333333c2;
    color: var(--bClr2);
    border-radius: var(--br);
    width: fit-content;

    &.add {
        background-color: var(--clr39);
        color: var(--bClr4);
        /* box-shadow: 0 0 2px 0px var(--clr4); */
    }
}

.match-num {
    font-size: 1rem;
    /* font-weight: bolder; */
}

.info-container {
    grid-area: info;
    border: none;
    padding: 0.6rem;

    color: var(--bClr2);
    border-radius: var(--br);
    display: grid;
    gap: 0.3rem;
    align-self: end;

    h4 {
        font-weight: 600;
        margin: 0;
        letter-spacing: 1px;
    }

    .sub-info {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 25% 25%;
        align-items: center;
        gap: 0.5rem;
    }
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