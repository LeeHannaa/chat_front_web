<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAPTList } from '../api/aptApi'
import { useAPTListStore } from '../stores/apt'

const router = useRouter()
const aptStore = useAPTListStore()
const myId = ref<number | null>(null)

async function getAPTList() {
  try {
    const data = await fetchAPTList()
    if (data) {
      aptStore.aptList = []
      aptStore.setAPTList(data)
      console.log('매물 목록:', data)
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getAPTList()
  const storedId = localStorage.getItem('userId')
  if (storedId) {
    myId.value = Number(storedId)
    console.log('myId : ', myId.value)
  }
  if (aptStore.aptList.length > 0) {
    console.log('전역 상태에서 매물 목록 불러옴:', aptStore.aptList)
  }
})

function handleAPTClick(apt: { id: number; name: string }) {
  router.push({
    path: '/aptdetail',
    query: {
      id: Number(apt.id),
      name: apt.name,
    },
  })
}
</script>

<template>
  <main>
    <div class="main">
      <h3>매물 리스트</h3>
      <div v-if="aptStore.aptList.length > 0">
        <div class="apt" v-for="apt in aptStore.aptList" :key="apt.id" style="cursor: pointer">
          <h3>{{ apt.name }}</h3>
          <button class="aptBT" @click="handleAPTClick(apt)">상세보기</button>
        </div>
      </div>
      <p v-else>볼 수 있는 매물이 없습니다.</p>
    </div>
  </main>
</template>

<style>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.apt {
  background: rgb(232, 255, 228);
  width: 200px;
  height: 100px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.aptBT {
  margin: 5px;
  font-size: 13px;
  width: 70px;
  height: 30px;
  background: #8ec78bff;
  border: none;
  border-radius: 10px;
}
</style>
