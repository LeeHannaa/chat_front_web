<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchChatList } from '../api/chatlistApi'
import { useChatListStore } from '../stores/chatlist'

const router = useRouter()
const chatStore = useChatListStore()
const userId = ref<number | null>(null)

async function getChatList() {
  if (userId.value === null) return
  try {
    const data = await fetchChatList(userId.value) // 임시 myId 넣기
    if (data) {
      chatStore.chatList = []
      chatStore.setChatList(data)
      console.log('채팅 목록:', data)
    }
  } catch (err) {
    console.error(err)
  }
}
function handleButtonClick() {
  if (userId.value !== null) {
    getChatList() // Call API with user ID on button click
  } else {
    console.error('사용자 아이디를 입력해 주세요.')
  }
}

onMounted(() => {
  if (chatStore.chatList.length > 0) {
    console.log('전역 상태에서 채팅 목록 불러옴:', chatStore.chatList)
  }
})

function handleChatClick(chat: { id: number; name: string }) {
  router.push({
    path: '/chat',
    query: {
      myId: Number(userId.value),
      id: Number(chat.id),
      name: chat.name,
      from: 'chatlist',
    },
  })
}
</script>

<template>
  <main>
    <div class="main">
      <h3>채팅 목록</h3>
      <h5>테스트 사용자 아이디 지정</h5>
      <div>
        <input v-model.number="userId" placeholder="아이디 입력" type="number" />
        <button @click="handleButtonClick" style="margin-left: 10px">확인</button>
      </div>
      <div v-if="chatStore.chatList.length > 0">
        <div
          class="chat"
          v-for="chat in chatStore.chatList"
          :key="chat.id"
          @click="handleChatClick(chat)"
          style="cursor: pointer"
        >
          <h3>{{ chat.name }}</h3>
          <p>{{ chat.lastMsg || '메시지가 없습니다' }}</p>
        </div>
      </div>
      <p v-else>채팅 목록이 없습니다.</p>
    </div>
  </main>
</template>

<style>
.chat {
  background: rgb(232, 255, 228);
  gap: 10px;
  width: 200px;
  height: 100px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
@media (min-width: 1024px) {
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .chat {
    background: rgb(232, 255, 228);
    gap: 10px;
    width: 200px;
    height: 100px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
