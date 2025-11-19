<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
    <h1 class="text-2xl md:text-3xl mb-6">新增文章</h1>

    <input v-model="title"
           class="w-full px-4 py-2 mb-4"
           placeholder="標題">
    <textarea v-model="content"
              class="w-full px-4 py-2 mb-4"
              rows="20"
              placeholder="內容"></textarea>

    <div class="flex gap-4">
      <button @click="save" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold me-5">儲存</button>
      <button @click="$router.push('/')" class="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold me-5">取消</button>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()

const title = ref('')
const content = ref('')

const save = async () => {
  const url = `http://localhost:5104/api/posts`

  await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: title.value, content: content.value})
  })

  router.push('/')
}
</script>
