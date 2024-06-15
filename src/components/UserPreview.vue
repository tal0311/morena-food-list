<template>
    <div class="user-preview grid">
            <!-- <pre>{{ props.user.imgUrl }}</pre> -->
            <img v-if="!isImageError" :src="props.user.imgUrl" :alt="props.user.fullname" @error="isImageError=true">
            <div class="user-initials" v-else >{{userInitials }}</div>
        </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    user: Object
})

const isImageError = ref(false)

const userInitials = computed(() => {
    return props.user.username.split(' ').map(name => name[0]).join('')
})


</script>

<style scoped>
.user-preview {
    height: 20vh;
    display: grid;
    justify-content: center;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .user-initials{
        width: 150px;
        height: 150px;
        display: grid;
        place-content: center;
        font-size: 4rem;
        border-radius: 50%;
        background-color: var(--bClr4);
        color: var(--bClr1);
    }
}

</style>