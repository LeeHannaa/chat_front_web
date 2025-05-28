<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="greetings">
        <h1 class="green">채팅 시스템</h1>
      </div>
      <nav>
        <RouterLink to="/">채팅 목록</RouterLink>
        <RouterLink to="/apt">매물 리스트</RouterLink>
        <RouterLink to="/person">개인 연락 테스트</RouterLink>
        <RouterLink to="/group">채팅방 생성 테스트</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
}

nav {
  width: 100%;
  height: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

nav a.router-link-exact-active {
  color: hsla(160, 100%, 37%, 1);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
h1 {
  font-weight: 500;
  font-size: 1.5rem;
  position: relative;
  text-align: center;
}
</style>
