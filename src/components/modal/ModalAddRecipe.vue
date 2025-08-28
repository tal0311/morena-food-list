<template>
    <section v-if="recipe" class="dashboard-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">{{ recipe._id ? 'Update' : 'Add' }} Recipe</h2>
            </div>
            
            <form class="modal-form" @submit.prevent="">
                <div class="form-group">
                    <label for="hebrew-title">Hebrew Title</label>
                    <input type="text" id="hebrew-title" placeholder="כותרת" v-model="recipe.he.title">
                </div>

                <div class="form-group">
                    <label for="hebrew-description">Hebrew Description</label>
                    <textarea id="hebrew-description" placeholder="תיאור" rows="5" v-model="recipe.he.description"></textarea>
                </div>

                <div class="section-divider">
                    <h3>English Content</h3>
                </div>

                <div class="form-group">
                    <label for="english-title">English Title</label>
                    <input type="text" id="english-title" placeholder="Title" v-model="recipe.en.title">
                </div>

                <div class="form-group">
                    <label for="english-description">English Description</label>
                    <textarea id="english-description" placeholder="Description" rows="5" v-model="recipe.en.description"></textarea>
                </div>
            <div class="section-divider">
                <h3>Recipe Image</h3>
            </div>

            <div class="form-group">
                <label for="recipe-image">Recipe Image</label>
                <div class="modal-grid modal-grid-2">
                    <div class="image-preview">
                        <img :src="recipe.imgUrl" alt="Recipe-img">
                    </div>
                    <div class="image-actions">
                        <button type="button" class="modal-btn modal-btn-secondary">
                            <label for="selectImg">
                                {{ isImageUploaded ? 'Change' : 'Upload' }} Image
                                <input @change="previewImg" class="img-input" id="selectImg" type="file" />
                            </label>
                        </button>
                        <button type="button" class="modal-btn modal-btn-secondary" @click="resetImg">
                            Reset Image
                        </button>
                    </div>
                </div>
            </div>
            </form>
            
            <div class="modal-actions">
                <button class="modal-btn modal-btn-primary" @click="saveRecipe">{{ recipe._id ? 'Update' : 'Add' }} Recipe</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { adminService } from '@/services/admin.service';
import { uploadService } from '@/services/upload.service';
import { recipeService } from '@/services/recipe.service.local';

const props = defineProps(['info']);
const recipe = ref(null);
const isImageUploaded = ref(false);



onMounted(() => {
   
    console.log('props.info', props.info);
    if (props.info) recipe.value = props.info;
    else {
        recipe.value = adminService.getEmptyRecipe();
    }
    // recipe.value = props.info adminService.getEmptyRecipe();
});

function previewImg(ev) {
    const file = ev.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        recipe.value.imgUrl = reader.result
        isImageUploaded.value = true
    };
    reader.readAsDataURL(file)
}

async function saveRecipe() {
    console.log('recipe', recipe.value);

    if (recipe.value.imgUrl.includes('base64')) {
        // adminService.saveRecipe(recipe.value);
        console.log('uploded-img');
        const { url } = await uploadService.uploadImg(recipe.value.imgUrl)
        recipe.value.imgUrl = url;

    }
    if (recipe.value.imgUrl.includes('foodservicerewards')) {
        // adminService.saveRecipe(recipe.value);
        console.log('default-img');
        recipe.value.imgUrl = '';
    }

    await recipeService.save(JSON.parse(JSON.stringify(recipe.value)));

    // eventName = recipe.value._id ? 'update' : 'add';    
    // updateService.addUpdate('recipe', recipe.value);
    recipe.value = adminService.getEmptyRecipe();
    isImageUploaded.value = false;
    // console.log('recipe', recipe.value);
    if (!recipe.value._id) {
        eventBus.emit('add-recipe', recipe.value);
    }

}
// console.log('recipe', recipe.value);
function resetImg() {
    recipe.value.imgUrl = adminService.getEmptyRecipe().imgUrl;
    isImageUploaded.value = false;
}

</script>

<style scoped>
@import '@/assets/modal-forms.css';
</style>
