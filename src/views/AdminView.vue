<template>
    <section class="admin-view">
        <h1>Welcome Admin ypu can update your data base from here</h1>

        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td contenteditable>{{ user.id }}</td>
                    <td contenteditable>{{ user.name }}</td>
                    <td contenteditable>{{ user.email }}</td>
                    <td contenteditable>{{ user.role }}</td>
                    <td>
                        <button @click="editUser(user.id)">Edit</button>
                        <button @click="deleteUser(user.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>


        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in getItemList" :key="item.id">
                    <td contenteditable>{{  }}</td>
                    <td contenteditable>{{ item.name }}</td>
                    <td contenteditable>{{ item.email }}</td>
                    <td contenteditable>{{ item.role }}</td>
                    <td>
                        <button @click="editItem(item._id)">Edit</button>
                        <button @click="deleteItem(item.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>

import { useListStore } from '@/stores/list-store';

const { users, getItemList } = useListStore();

</script>

<style scoped></style>