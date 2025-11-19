<template>
  <div id="container" class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl" v-if="post">
    <div id="title" class="flex align-items-center mb-5">
      <h1 class="text-5xl">{{ post.title }}</h1>
    </div>
    <div id="body" class="mb-5">
      {{ post.body }}
    </div>

    <!-- 之後再加登入判斷 -->
    <div>
      <button @click="editPost" class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold me-5">編輯</button>
      <button @click="deletePost" class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold me-5">刪除</button>
      <button @click="archivePost" class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold me-5">隱藏</button>
    </div>
    <div id="publish-time" class="flex content-end">
      <p>發布時間: {{ post.created_time }}</p>
    </div>
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

const archivePost = async () => {
  if (confirm('確定典藏?')) {
    await fetch(`http://localhost:5104/api/posts/${route.params.id}`, {
      method: 'PATCH'
    })
    await router.push('/')
  }
}

const editPost = () => {
  router.push({ name: 'post-edit', params: { id: post.value.id } })
}

const deletePost = async () => {
  if (confirm('確定刪除?')) {
    await fetch(`http://localhost:5104/api/posts/${route.params.id}`, {
      method: 'DELETE'
    })
    await router.push('/')
  }
}
</script>
