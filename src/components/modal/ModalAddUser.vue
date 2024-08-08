<template>

    <section class="modal-add-user">


        <form @submit.prevent="addUser" class="grid grid-dir-cols">

            <label for="" class="grid grid-dir-cols">
                username
                <input type="text" v-model="user.name" placeholder="name" />
            </label>

            <label for="" class="grid grid-dir-cols">
                email
                <input type="text" v-model="user.email" placeholder="email" />
            </label>

            <label for="" class="grid grid-dir-cols">
                role
                <input type="text" v-model="user.role" placeholder="role" />

            </label>

            <button class="secondary-btn" type="submit">add</button>

        </form>

    </section>


    <section>

        <!-- {{ user }} -->
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { userService } from '@/services/user.service';

const user = ref(userService.getEmptyUser())
</script>

<style scoped>
.modal-add-user {
    background-color: #fff;
    padding: 1rem;
    border-radius: var(--br);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);



    form {
        gap: 1rem;

        label {

            font-size: 1.2rem;
            gap: 0.5rem;
            input {
                color:var(--bClr3) ;
                padding: 0.2rem 0.5rem;
                border-radius: var(--br);
                font-size: inherit;
                border:1px solid var(--bClr3);

                &::placeholder{
                    color:var(--bClr1) ;
                }
            }


        }
        .secondary-btn{
            max-width: 100px;
            padding: 0.5rem 1rem;
        }
    }
}
</style>