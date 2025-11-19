<template>
  <header class="page-header w-full max-w-7xl mx-auto px-4 mb-5">
    <!--    <h1>我的部落格</h1>-->
    <h1 class="text-6xl">test</h1>
  </header>

  <div class="container w-full max-w-7xl mx-auto px-4">

    <!-- 簡單列表先不管樣式 -->
    <div id="navigation-bar" class="flex mb-10">
      <div class="home me-10">
        <router-link to="/">首頁</router-link>
      </div>
      <div class="addPost me-10">
        <router-link to="/post/add">新增文章</router-link>
      </div>
      <div class="login me-10">
        <router-link to="/">登入</router-link>
      </div>
      <div class="register">
        <router-link to="/">註冊</router-link>
      </div>
    </div>
    <div v-for="post in posts" :key="post.id" class="mb-5">
      <div class="title mb-5">
        <router-link :to="'/post/' + post.id" class="text-2xl"> {{ post.title }}</router-link>
      </div>
      <div class="content">
        <p>{{ post.body }}</p>
      </div>
      <div class="footer">
        <p>{{ post.created_time }}</p>
      </div>
      <hr>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const posts = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:5104/api/posts')
  const result = await res.json()
  posts.value = result.data
})
</script>
