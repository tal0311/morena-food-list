<template>
    <section>
        <h1>Dev View</h1>


        <h2>Local Storage</h2>
        <pre>{{ getLoggedUser() }}</pre>



    </section>


</template>

<script setup>

function getLoggedUser() {
    return JSON.parse(localStorage.getItem('loggedUser'));
}


</script>

<style scoped></style>