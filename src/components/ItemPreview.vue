<template>
<!-- <pre>{{ props.item }}</pre> -->
<section class="item-preview">
    
    <input type="checkbox" id="item-checkbox">
    <label for="item-checkbox">
        <span>{{ props.item.name }}</span> | 
        <span>{{ props.item.icon}}</span>
        
   </label>

  <span>{{ item.group }}</span>
    
</section>
</template>

<script setup> 

import { defineProps } from 'vue';
const props= defineProps({
  item: Object
})
</script>

<style scoped></style>