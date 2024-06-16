<template>
    <section class="info-modal">
        <!-- <pre>{{ infoForDisplay }}</pre> -->
        <!-- <h3>{{ infoForDisplay.title }}</h3>
        <p>{{ infoForDisplay.info }}</p> -->
        <h3>{{ infoForDisplay.title }}</h3>
        <!-- <textarea class="info" :value="infoForDisplay.info" rows="15"></textarea> -->
        <p>{{ infoForDisplay.info }}</p>
    </section>

</template>

<script setup>
import { computed, watchEffect ,ref} from 'vue';
import { useUserStore } from '@/stores/user-store';
import { moreInfoService } from '@/services/moreinfo.service';

const props= defineProps({
    info:String
})

const infoForDisplay = ref(null)
const userStore= useUserStore()
const currLang= computed(() => userStore.getCurrLang)
watchEffect(() => {
    if (props.info) {
         
        console.log('props.info',props.info);
        console.log('currLang.value',currLang.value);
        infoForDisplay.value= moreInfoService.getInfoByLabel(props.info,currLang.value)
    }
})
</script>

<style scoped>
.info-modal{
    /* width: 80vh; */
    background-color: var(--bClr1);
    border-radius: var(--br);
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
    height: fit-content;
  
    .info{
        margin-block: 1rem;
        background-color: transparent;
        text-align: start;
        /* outline: 1px solid var(--bClr1); */
        resize: none;
        width: 100%;
        border: none;
        padding: 0.3rem;
        font-family: inherit;
        font-size: 1.2rem;
        
    }
}
</style>