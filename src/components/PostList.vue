<template>
  <div>
    <h1>Posts</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>{{ postsData }}</div>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {getPostsList} from '@/API/PostApi';
import {onMounted, ref} from "vue";

const postsData = ref<string>('')
const loading = ref<boolean>(true)
const error = ref<string>('')

onMounted(() => {
  loadPostList()
})

async function loadPostList() {
  try {
    loading.value = true
    const response = await getPostsList()
    console.log(response)
    const jsonData = await response.json()
    console.log(jsonData)
    postsData.value = jsonData.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

</script>
