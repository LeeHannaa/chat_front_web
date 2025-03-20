<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type APTDetail } from '../stores/apt'
import { fetchAPTDetailList } from '../api/aptApi'

const router = useRouter()
const myId = ref<number | null>(null)
const aptDetail = ref<APTDetail | null>(null)

const props = defineProps<{
  id: number
  name: string
}>()

async function getAPTDetail() {
  try {
    const data = await fetchAPTDetailList(props.id)
    if (data) {
      console.log('매물 목록:', data)
      aptDetail.value = {
        id: data.id, // 매물 아이디
        name: data.name,
        userId: data.userId,
      }
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getAPTDetail()
  const storedId = localStorage.getItem('userId')
  if (storedId) {
    myId.value = Number(storedId)
    console.log('myId : ', myId.value)
  }
})

function handleAPTClick(apt: { id: number; name: string }) {
  router.push({
    path: '/chat',
    query: {
      id: Number(apt.id),
      name: apt.name,
      from: 'aptlist',
    },
  })
}
</script>

<template>
  <main>
    <div class="main">
      <h3>매물 상세 정보 페이지</h3>
      <div class="aptDetail" style="cursor: pointer">
        <h3>{{ aptDetail?.name }}</h3>
        <p style="margin-bottom: 50px">기타 등등의 정보들</p>
        <button v-if="aptDetail?.userId === myId" class="aptDetailBT">매물 수정</button>
        <button v-else class="aptDetailBT" @click="aptDetail && handleAPTClick(aptDetail)">
          채팅 문의
        </button>
      </div>
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
.aptDetail {
  margin: 20px;
  width: 200px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.aptDetailBT {
  margin: 5px;
  font-size: 13px;
  width: 70px;
  height: 30px;
  background: #8ec78bff;
  border: none;
  border-radius: 10px;
}
</style>
