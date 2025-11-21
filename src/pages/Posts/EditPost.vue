<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
    <h1 class="text-2xl md:text-3xl mb-6">編輯文章</h1>
    <div>{{ title }}</div>
    <div>
 <textarea v-model="content" class="w-full px-4 py-2 mb-4" rows="20" placeholder="內容">{{content}}</textarea>
    </div>

    <div class="flex gap-4">
      <button @click="save" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold me-5">儲存</button>
      <button @click="$router.push('/')" class="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold me-5">取消
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'

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
  console.log(post)
  title.value = post.title
  content.value = post.content
})

const save = async () => {
  const postId = route.params.id
  const url = `http://localhost:5104/api/posts/${postId}`

  await fetch(url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: title.value, content: content.value})
  })

  router.push('/')
}
</script>
