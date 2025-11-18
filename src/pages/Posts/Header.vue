<template>
  <header class="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
    <h1 class="text-xl font-bold cursor-pointer" @click="$router.push('/')">
      MyBlog
    </h1>

    <nav class="flex gap-4">
      <router-link to="/" class="hover:text-blue-600">Home</router-link>

      <router-link
          v-if="!isLogin"
          to="/login"
          class="hover:text-blue-600"
      >
        Login
      </router-link>

      <router-link
          v-else
          to="/editor"
          class="hover:text-blue-600"
      >
        Write
      </router-link>
    </nav>
  </header>
</template>

<script setup>
const isLogin = false // todo :之後用 Pinia 或 token 判斷
</script>
