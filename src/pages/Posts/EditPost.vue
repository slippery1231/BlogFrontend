<template>
  <div>
    <h1>編輯文章</h1>

    <input v-model="title" placeholder="標題">
    <textarea v-model="content" rows="20" placeholder="內容">{{content}}</textarea>

    <button @click="save">儲存</button>
    <button @click="$router.push('/')">取消</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = ref('')
const content = ref('')

// 先撈資料
onMounted(async () => {
  const postId = route.params.id
  const res = await fetch(`http://localhost:5104/api/posts/${postId}`)
  const result = await res.json()
  const post = result.data
  title.value = post.title
  content.value = post.content
})

const save = async () => {
  const postId = route.params.id
  const url = `http://localhost:5104/api/posts/${postId}`

  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.value, content: content.value })
  })

  router.push('/')
}
</script>
