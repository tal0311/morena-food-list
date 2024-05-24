<template>
    <div class="user-preview grid">
            <img :src="props.user.imgUrl"/>
        </div>
</template>

<script setup>

const props = defineProps({
    user: Object
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
}

</style>