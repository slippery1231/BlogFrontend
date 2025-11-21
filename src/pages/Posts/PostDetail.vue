<template>
  <div id="container" class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-8" v-if="post">
    <!-- 文章標題 -->
    <div id="title" class="mb-4">
      <h1 class="text-5xl font-bold">{{ post.title }}</h1>
    </div>

    <!-- 發布時間 -->
    <div id="publish-time" class="mb-8 text-gray-400 text-sm">
      <p>發布時間: {{ post.created_time }}</p>
    </div>

    <!-- 文章內容區 -->
    <div id="body" class="mb-12 min-h-[200px] whitespace-pre-wrap leading-relaxed text-lg">
      {{ post.body }}
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque cum earum iusto magni, minima molestias natus perspiciatis provident quae quasi quia, quidem quo ratione similique ullam voluptate? Modi, quidem!
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque cum earum iusto magni, minima molestias natus perspiciatis provident quae quasi quia, quidem quo ratione similique ullam voluptate? Modi, quidem!
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque cum earum iusto magni, minima molestias natus perspiciatis provident quae quasi quia, quidem quo ratione similique ullam voluptate? Modi, quidem!
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque cum earum iusto magni, minima molestias natus perspiciatis provident quae quasi quia, quidem quo ratione similique ullam voluptate? Modi, quidem!
    </div>

    <!-- 操作按鈕 -->
    <div class="flex gap-3 pt-8 border-t border-gray-700">
      <button @click="editPost" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition">
        編輯
      </button>
      <button @click="archivePost" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition">
        隱藏
      </button>
      <button @click="deletePost" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold ml-auto transition">
        刪除
      </button>
    </div>
  </div>
</template>>

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
