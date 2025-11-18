<template>
  <div>
    <h1>新增文章</h1>

    <input v-model="title" placeholder="標題">
    <textarea v-model="content" rows="20" placeholder="內容"></textarea>

    <button @click="save">儲存</button>
    <button @click="$router.push('/')">取消</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

const title = ref('')
const content = ref('')

const save = async () => {
  const url = `http://localhost:5104/api/posts`

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.value, content: content.value })
  })

  router.push('/')
}
</script>
