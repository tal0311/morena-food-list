<template>
    <details :open="props.open">
        <summary @click.stop.prevent="">{{ filterBy }}</summary>
        <div class="create-btn grid">
            <button @click="$emit('create')">create</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th v-for="head in tableHeaders">{{ head }}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="entity in entities" :key="entity._id" :class="props.filterBy">
                    <td v-for="head in tableHeaders" class="entities-td">
                        {{ getEntityValue(entity, head) }}
                    </td>

                    <td>
                        <div class="actions-container grid grid-dir-col">
                            <button @click="$emit('remove', entity._id)">Delete</button>
                            <button @click="$emit('select', entity._id)">Select</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </details>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({

    entity: Array,
    filterBy: String,
    open: Boolean

})

const tableHeaders = computed(() => {
    switch (props.filterBy) {
        case 'user':
            return ['Username', 'Email', 'Role']
        case 'item':
            return ['Group', 'Name']
        case 'list':
            return ['Title', 'Items', 'Owner']
        case 'recipe':
            return ['Title', 'Description', 'Owner', 'Image']

    }
})

const entities = ref(props.entity)

const emit = defineEmits(['create', 'remove', 'select'])


function getEntityValue(entity, head) {
    head = head.toLowerCase()

    if (head === 'owner') {
        return entity.owner.username
    }
    if (head === 'items' && props.filterBy === 'list') {
        return entity.items.map(item => item.name).join(', ')
    }

   
    if (props.filterBy === 'recipe') {
        if (head === 'title') {
            return entity.en.title + '\n**********\n' + entity.he.title
        }
        if (head === 'description') {
            return entity.en.description + '\n**********\n' + entity.he.description
        }
        if (head === 'image') {
            return entity.imgUrl ? '✅' : '❌'
        }
    }
    return entity[head]
}

</script>

<style scoped>
details {
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    overflow-x: auto;

    summary {
        font-size: 1.2rem;
        font-weight: bold;
    }

    table {
        margin-top: 2rem;
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            border: 1px solid #ccc;
            padding: 0.5rem;
        }

        th {
            background: #f0f0f0;
        }

        td {
            text-align: center;
        }

        tr:nth-child(even) {
            background: #f0f0f0;
        }

        tr:hover {
            background: #f0f0f0;
        }
    }
}

.create-btn {
    justify-content: flex-end;

    button {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
}

.actions-container {
    gap: 1rem;
}

button {
    padding: 0.5rem 1rem;
}

.user {
    border-bottom: 1px solid #ccc;
}

.entities-td {
    white-space: pre-wrap;
    text-align: center;
}
</style>