<template>
    <section>


        <article class="recipe-preview grid" @click="isOpen = !isOpen">
            <img :src="props.recipe.image" :alt="props.recipe.title">
            <div v-if="props.is === 'match'" class="match">
                <span class="match-num" :style="getStyle">Products match {{ props.recipe.percentage }} %</span>
            </div>
            <div v-else class="match add" @click.stop="addToList">
                {{ btnStatus }}
            </div>
            <div class="info-container grid">
                <h4>{{ props.recipe.title }}</h4>
                <div class="sub-info grid">
                    <span>{{ props.recipe.level }} </span> <span>{{ props.recipe.prepTime }}min</span>
                </div>
            </div>
        </article>

        <section v-if="isOpen">

            <ul>
                <li v-for="step in props.recipe.instructions" :key="step">
                    {{ step }}
                </li>
            </ul>

        </section>


    </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    recipe: {
        type: Object,

    },
    is: {
        type: String
    }
})


const btnStatus = ref('Add to list');
const isOpen = ref(false);

// const url = computed(() => {
//   return new URL(`../assets/images/recipe/${props.recipe.recipe.image}`).href;
// });


const emit = defineEmits(['addToList']);
function addToList() {
    
    if (btnStatus.value === 'Added') return;
    btnStatus.value = 'Added';
    emit('addToList', props.recipe._id);


}


const getStyle = computed(() => {
    
    if (props.recipe.percentage > 90) {
        return {
            color: 'lightgreen'
        };
    } else if (props.recipe.percentage > 80) {
        return {
            color: 'green'
        };
    } else if (props.recipe.percentage > 70) {
        return {
            color: 'yellow'
        };
    } else if (props.recipe.percentage > 60) {
        return {
            color: 'lightyellow'
        };
    } else if (props.recipe.percentage > 50) {
        return {
            color: 'orange'
        };
    } else if (props.recipe.percentage > 40) {
        return {
            color: 'darkorange'
        };
    } else if (props.recipe.percentage > 20) {
        return {
            color: 'red'
        };
    } else {
        return {
            color: 'gray'
        };
    }

})

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