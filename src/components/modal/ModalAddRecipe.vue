<template>
    <section v-if="recipe" class="add-recipe" >
        <h2>{{ recipe._id ? 'Update' : 'Add' }} recipe</h2>
        <form class="grid" @submit.prevent="">
            <label for="">
                <div class="grid info-wrapper rtl ">

                    <input type="text" placeholder="כותרת" v-model="recipe.he.title">
                    <textarea type="text" placeholder="תיאור" rows="10" v-model="recipe.he.description"></textarea>
                </div>
                <hr>
                <div class="grid info-wrapper">

                    <input type="text" placeholder="Title" v-model="recipe.en.title">
                    <textarea type="text" placeholder="Title" rows="10" v-model="recipe.en.description"></textarea>

                </div>
            </label>
            <div class="img-wrapper grid">

                <label for="">
                    <!-- Use the computed property to display either tempImg or existing recipe image -->
                    <img :src="recipe.imgUrl" alt="Recipe-img">
                </label>

                <div class="actions-container grid grid-dir-col">

                    <button class="primary-btn upload ">
                        <label for="selectImg">
                            {{ isImageUploaded ? 'Change' : 'Upload' }} image
                            <input @change="previewImg" class="img-input" id="selectImg" type="file"
                                placeholder="Title" />
                        </label>
                    </button>
                    <button class="primary-btn" @click="resetImg">
                        Reset Image
                    </button>
                </div>
            </div>
            <button type="submit" class="secondary-btn" @click="saveRecipe">{{ recipe._id ? 'Update' : 'Add' }} recipe</button>
        </form>
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
.add-recipe {
    hr{
        margin: 1.5rem 0;
    }
    .secondary-btn{
        /* margin: 1rem 0; */
        padding: 0.5rem;
        text-align: start;
        max-width: fit-content;
    }


    padding: 20px;
    background-color: #fff;
    border-radius: 6px;

    form {


        gap: 1rem;

        .info-wrapper {
            gap: 1rem;

            input,
            textarea {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ccc;
                border-radius: var(--br);
            }
        }

        .actions-container {
            gap: 1rem;
        }
    }

    &::-ms-thumb {
        display: none;
    }
}

.img-wrapper {
    place-content: center;
}

.primary-btn {
    padding: 0.5rem;
    max-width: 300px;

    /* margin: 0 auto; */
}

.img-input {
    display: none;
}

img {
    border-radius: var(--br);
    width: 300px;
    height: 300px;
    object-fit: cover;
}
</style>
