<template>
  <div v-if="post">
    <div class="title" style="display: flex; align-items: center;">
      <h1>{{ post.title }}</h1>
      <p>發布時間: {{ post.created_time }}</p>
    </div>
    <div class="body">
      {{ post.body }}
    </div>

    <!-- 之後再加登入判斷 -->
    <button @click="editPost">編輯</button>
    <button @click="deletePost">刪除</button>
    <button @click="archivePost">隱藏</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const post = ref(null)

onMounted(async () => {
  const postId = route.params.id
  const res = await fetch(`http://localhost:5104/api/posts/${postId}`)
  const result = await res.json()
  post.value = result.data
})

const archivePost = () => {
  router.push('/')
}

const editPost = () => {
  router.push({ name: 'post-edit', params: { id: post.value.id } })
}

const deletePost = async () => {
  if (confirm('確定刪除?')) {
    await fetch(`http://localhost:5104/api/posts/${route.params.id}`, {
      method: 'DELETE'
    })
    router.push('/')
  }
}
</script>
