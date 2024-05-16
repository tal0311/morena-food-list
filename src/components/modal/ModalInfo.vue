<template>
    <section class="info-modal">
        <h3>{{ infoForDisplay.title }}</h3>
        <p>{{ infoForDisplay.info }}</p>
    </section>

</template>

<script setup>
import { computed, watchEffect ,ref} from 'vue';
import { useListStore } from '@/stores/list-store';
import { moreInfoService } from '@/services/moreinfo.service';

const props= defineProps({
    info:String
})

const infoForDisplay = ref(null)
const listStore = useListStore()
const currLang= computed(() => listStore.getCurrLang)
watchEffect(() => {
    if (props.info) {
         
        infoForDisplay.value= moreInfoService.getInfoByLabel(props.info,currLang.value)
        console.log(infoForDisplay.value);
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
  
}
</style>