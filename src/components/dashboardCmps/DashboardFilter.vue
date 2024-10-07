<template>
    <section class="admin-filter grid ">

        <section class="entity-filter grid">
            <span>Filter By: </span>

            <section class="actions-container grid grid-dir-col">

                <button v-for="btn in btns" :class="`${props.filterBy === btn ? 'primary-btn' : 'secondary-btn'}`"
                    @click="$emit('setFilterBy', btn)">{{ btn }}</button>

            </section>

        </section>
        <form>
            <label for="search" class="grid grid-dir-col">
                Search: <input type="text" name="search" @input="$emit('update:modelValue', $event.target.value)"
                    :placeholder="`Search ${props.filterBy}`" />

            </label>

        </form>
    </section>

</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['filterBy', 'modalValue'])

const btns = ref(['user', 'item', 'list', 'recipe'])

</script>

<style scoped>
.admin-filter {

    gap: 1.5rem;

    .entity-filter {
        padding-inline: 0.5rem;
        grid-template-columns: 100px min-content;
        grid-auto-flow: column;
        gap: 1rem;
        align-items: center;
        font-size: larger;


        .secondary-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }

        .actions-container {
            gap: 1rem;

            button {
                padding: 0.5rem 1rem;


            }
        }
    }

    form {
        background: #f0f0f0;

        label {
            padding: 0.5rem;
            align-items: center;
            font-size: larger;
            gap: 0.5rem;
            grid-template-columns: min-content auto;
            width: 100%;

            input {
                padding: 0.5rem;
                border: none;
                border-radius: 5px;
                font-size: inherit;
            }
        }




    }
}
</style>