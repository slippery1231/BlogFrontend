<template>
  <div>
    <h1>我的部落格</h1>

    <!-- 簡單列表先不管樣式 -->
    <div class="navgation-bar">
      <button>首頁</button>
      <button>新增文章</button>
    </div>
    <div v-for="post in posts" :key="post.id">
      <div class="title">
        <router-link :to="'/post/' + post.id"> {{ post.title }}</router-link>
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
import { ref, onMounted } from 'vue'

const posts = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:5104/api/posts')
  const result = await res.json()
  posts.value = result.data
})
</script>
