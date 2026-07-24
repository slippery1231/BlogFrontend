<template>
  <main class="tw-wrap">
    <div class="issue-row">
      <div class="eyebrow">ANNOUNCEMENT</div>
      <div class="page-title">
        <q-icon name="mdi-bullhorn" class="title-icon" />
        公告欄
      </div>
    </div>

    <div v-if="pageLoading" class="state">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="announcements.length === 0" class="state empty">{{ t('announcement.noAnnouncement') }}</div>

    <div v-else class="announcement-card">
      <q-expansion-item v-for="announcement in announcements" :key="announcement.id" class="announcement-item" expand-icon-class="expand-icon" @show="loadAttachments(announcement)">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="mdi-bullhorn-outline" class="bullhorn-icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="announcement-title">{{ announcement.title }}</q-item-label>
            <q-item-label caption class="announcement-caption">
              <div class="content-preview" v-html="announcement.content"></div>
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <div class="row items-center q-gutter-xs">
              <q-icon v-if="announcement.pinned" name="mdi-pin" class="pin-icon" size="16px" />
              <q-item-label caption class="announcement-caption">{{ fromISO8601DateTimeMinute(announcement.publishedAt) }}</q-item-label>
            </div>
          </q-item-section>
        </template>

        <div class="announcement-content q-editor-content" v-html="announcement.content" />
        <div v-if="announcement.attachmentsLoading" class="row justify-center q-mb-lg">
          <q-spinner-dots color="primary" size="24px" />
        </div>
        <div v-else-if="announcement.attachments?.length" class="q-mb-lg">
          <h3 class="text-subtitle1 text-weight-medium q-mb-sm">附件下載</h3>
          <q-list bordered separator>
            <q-item v-for="attachment in announcement.attachments" :key="attachment.currentFileName" :href="attachment.url" target="_blank" clickable>
              <!-- 圖片給縮圖預覽，其他型別給檔案 icon -->
              <q-item-section avatar>
                <q-img
                  v-if="isImageType(attachment.contentType)"
                  :src="attachment.url"
                  :alt="attachment.displayFileName || 'image'"
                  width="48px"
                  height="48px"
                  fit="cover"
                  class="rounded-borders"
                />
                <q-icon v-else :name="fileIcon(attachment.contentType)" color="grey-7" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ attachment.displayFileName || attachment.originalFileName }}</q-item-label>
                <q-item-label caption>{{ formatFileSize(attachment.fileSize) }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="mdi-download" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-expansion-item>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { fromISO8601DateTimeMinute } from '@/composables/useDateTimeConverter.ts'

import {
  getAnnouncements,
  type AnnouncementResponse,
  type AnnouncementAttachmentsResponse,
  getAnnouncementById
} from '@/services/announcement/announcementService.ts'

interface AnnouncementListItem extends AnnouncementResponse {
  attachments?: AnnouncementAttachmentsResponse[]
  attachmentsLoaded?: boolean // 是否已經載入
  attachmentsLoading?: boolean // 是否正在載入
}

const { t } = useI18n()
const pageLoading = ref(false)
const announcements = ref<AnnouncementListItem[]>([])

// ==================== function ====================

/** 判斷是否為圖片類型 */
function isImageType(contentType: string): boolean {
  return contentType?.startsWith('image/')
}

/** 依檔案類型回傳對應 icon */
function fileIcon(contentType: string): string {
  if (contentType?.startsWith('image/')) return 'mdi-file-image-outline'
  if (contentType === 'application/pdf') return 'mdi-file-pdf-box'
  if (contentType?.includes('word')) return 'mdi-file-word-outline'
  if (contentType?.includes('excel') || contentType?.includes('spreadsheet')) return 'mdi-file-excel-outline'
  if (contentType?.includes('zip') || contentType?.includes('compressed')) return 'mdi-folder-zip-outline'
  return 'mdi-file-outline'
}

/** 將位元組數格式化為易讀的檔案大小 */
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/** 展開公告時才查詢附件，避免列表一次查詢所有附件；已查過則不重複打 API */
async function loadAttachments(announcement: AnnouncementListItem) {
  if (announcement.attachmentsLoaded || announcement.attachmentsLoading) return
  announcement.attachmentsLoading = true
  try {
    const response = await getAnnouncementById(announcement.id)
    announcement.attachments = response.result.data?.attachments ?? []
    announcement.attachmentsLoaded = true
  } finally {
    announcement.attachmentsLoading = false
  }
}

async function loadAnnouncements() {
  pageLoading.value = true
  try {
    const response = await getAnnouncements()
    announcements.value = (response.result.data ?? [])
      // 顯示條件
      // 1. isActive === true && publishedAt 有值
      // 2. 1成立，再看expiresAt是否生效
      .filter((a) => a.isActive && a.publishedAt && (!a.expiresAt || new Date(a.expiresAt) > new Date()))
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
      })
  } finally {
    pageLoading.value = false
  }
}

// ==================== life cycle ====================
onMounted(async () => {
  await loadAnnouncements()
})
</script>

<style scoped>
.issue-row {
  border-bottom: 1px solid var(--line);
  padding-bottom: 18px;
  margin-bottom: 32px;
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1.5px;
  color: var(--rust-deep);
  text-transform: uppercase;
}
.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 600;
  color: var(--ink);
  margin-top: 8px;
}
.title-icon {
  color: var(--rust);
}

.state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}
.state.empty {
  color: var(--ink-soft);
  font-family: var(--font-reading);
}

.announcement-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 3px;
  overflow: hidden;
}

.announcement-item:not(:last-child) {
  border-bottom: 1px solid var(--line);
}

.announcement-item :deep(.q-item) {
  padding: 14px 18px;
}

.bullhorn-icon {
  color: var(--rust);
}
.pin-icon {
  color: var(--rust);
}

.announcement-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}
.announcement-caption {
  font-family: var(--font-sans);
  color: var(--ink-soft) !important;
}

.announcement-item :deep(.expand-icon) {
  color: var(--ink-soft);
}

.announcement-content {
  font-family: var(--font-reading);
  color: var(--ink);
  padding: 14px 18px 18px;
  border-top: 1px solid var(--line);
}

.content-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-preview :deep(*) {
  display: inline !important;
  font-size: inherit !important;
  font-family: inherit !important;
  color: inherit !important;
  font-weight: inherit !important;
  margin: 0 !important;
  padding: 0 !important;
}

.q-editor-content :deep(ol),
.q-editor-content :deep(ul) {
  padding-left: 1.5em;
  margin: 0.25em 0;
  list-style-position: outside;
}

.q-editor-content :deep(ol) {
  list-style-type: decimal;
}

.q-editor-content :deep(ul) {
  list-style-type: disc;
}

.q-editor-content :deep(li) {
  margin: 0;
  padding-left: 0;
}

.q-editor-content :deep(p) {
  margin: 0;
  padding: 0;
}

@media (max-width: 720px) {
  .page-title {
    font-size: 20px;
  }
}
</style>
