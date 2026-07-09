<template>
  <div class="site">
    <header class="top-nav">
      <router-link :to="{ name: 'home' }" class="brand">
        <svg class="brand-mark" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M1 11 Q6 4 11 11 T21 11" stroke="var(--paper)" stroke-width="1.6" />
          <path d="M1 16 Q6 9 11 16 T21 16" stroke="var(--rust)" stroke-width="1.6" />
        </svg>
        <span class="brand-name">{{ t('app.title') }}</span>
      </router-link>

      <nav class="nav-links">
        <router-link :to="{ name: 'home' }" active-class="active" exact>{{ t('nav.home') }}</router-link>
        <router-link :to="{ name: 'postList' }" active-class="active">{{ t('nav.posts') }}</router-link>
      </nav>

      <div class="nav-actions">
        <button class="icon-btn" :title="t('actions.search')" aria-label="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--paper)" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>
        <button class="icon-btn text-btn" :title="t('nav.about')" aria-label="language" @click="toggleLocale">
          {{ locale === 'zh-TW' ? 'EN' : '中' }}
        </button>
        <button class="icon-btn" aria-label="theme" @click="toggleDark">
          <svg v-if="$q.dark.isActive" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="var(--paper)" stroke-width="2" stroke-linecap="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        </button>
        <button v-if="userStore.isAuthenticated" class="auth-nav-btn" @click="logout">
          {{ t('auth.logout') }}
        </button>
        <button v-else class="auth-nav-btn" @click="router.push({ name: 'login' })">
          {{ t('auth.login') }}
        </button>
        <button class="subscribe-btn">{{ t('actions.subscribeNewsletter') }}</button>
      </div>
    </header>

    <router-view />

    <footer class="site-footer">
      <span>{{ t('footer.rights') }}</span>
      <div>
        <button type="button" class="footer-link">{{ t('footer.about') }}</button>
        <button type="button" class="footer-link">{{ t('footer.privacy') }}</button>
        <button type="button" class="footer-link">{{ t('footer.rss') }}</button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/useUser'

const $q = useQuasar()
const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()

/** 登出並回到首頁 */
function logout() {
  userStore.clearUser()
  router.push({ name: 'home' })
}

/** 切換語言（繁中 ⇄ English） */
function toggleLocale() {
  locale.value = locale.value === 'zh-TW' ? 'en-US' : 'zh-TW'
}

/** 深色模式切換 */
function toggleDark() {
  $q.dark.toggle()
}
</script>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ---------- 頂部導覽列 ---------- */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 56px;
  background: var(--indigo-deep);
  color: var(--paper);
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--paper);
  text-decoration: none;
  cursor: pointer;
}
.brand-mark {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.brand-name {
  font-family: var(--font-serif);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 34px;
}
.nav-links a {
  color: var(--paper);
  opacity: 0.78;
  text-decoration: none;
  font-size: 14px;
  letter-spacing: 0.3px;
  padding-bottom: 4px;
  transition: opacity 0.15s;
}
.nav-links a:hover {
  opacity: 1;
}
.nav-links a.active {
  opacity: 1;
  font-weight: 600;
  border-bottom: 1.5px solid var(--rust);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}
.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(242, 239, 230, 0.3);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--paper);
  padding: 0;
}
.icon-btn svg {
  width: 15px;
  height: 15px;
}
.icon-btn.text-btn {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.5px;
}
.auth-nav-btn {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--paper);
  background: transparent;
  border: 1px solid rgba(242, 239, 230, 0.3);
  padding: 7px 14px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background-color 0.15s ease;
}
.auth-nav-btn:hover {
  background: rgba(242, 239, 230, 0.12);
}
.subscribe-btn {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--indigo-deep);
  background: var(--paper);
  border: none;
  padding: 9px 18px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.5px;
}

/* ---------- 頁尾 ---------- */
.site-footer {
  border-top: 1px solid var(--line);
  margin-top: auto;
  max-width: 1180px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 22px 56px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink-soft);
}
.footer-link {
  font-family: inherit;
  font-size: inherit;
  color: var(--ink-soft);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-left: 18px;
}
.footer-link:hover {
  color: var(--rust-deep);
}

@media (max-width: 720px) {
  .top-nav {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .nav-links {
    order: 3;
    width: 100%;
    gap: 22px;
  }
  .site-footer {
    padding: 22px 20px 32px;
    flex-direction: column;
    gap: 12px;
  }
}
</style>