<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchChatList, fetchChatDelete } from '../api/chatlistApi'
import { fetchUserInfo } from '../api/userApi'
import { useChatListStore } from '../stores/chatlist'
import { formatDate } from '../plugins/formatDate'

const router = useRouter()
const chatStore = useChatListStore()
const myId = ref<number | null>(null)
const myName = ref<string | null>(null)

async function getChatList() {
  if (myId.value === null) return
  try {
    getUserInfo() // 이름 로컬에 저장
    const data = await fetchChatList(myId.value) // 임시 myId 넣기
    if (data) {
      chatStore.chatList = []
      chatStore.setChatList(data)
      chatStore.chatList.sort(
        (a, b) => b.updateLastMsgTime!.getTime() - a.updateLastMsgTime!.getTime(),
      )
      console.log('채팅 목록:', data)
    }
    connectSocket()
  } catch (err) {
    console.error(err)
  }
}

import { Client } from '@stomp/stompjs'
let websocketClient: Client
let subscription: any = null

async function connectSocket() {
  // TODO : 소켓 연결
  const url = 'ws://localhost:8080/ws-stomp'
  if (websocketClient && websocketClient.active) {
    websocketClient.deactivate()
    console.log('이미 연결된 웹소켓 연결 취소.')
  }

  websocketClient = new Client({
    brokerURL: url,
    debug: (str) => {
      console.log(str)
    },
    onConnect: () => {
      console.log('채팅리스트 웹소켓 연결 성공!')

      // 기존 구독이 있으면 해제
      if (subscription) {
        subscription.unsubscribe()
      }

      subscription = websocketClient.subscribe(`/topic/chatlist/${myId.value}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body)
          console.log('채팅새로옴!!', parsedMessage)

          const index = chatStore.chatList.findIndex((chat) => chat.roomId === parsedMessage.roomId)
          if (index !== -1) {
            // 이미 있는 채팅방: 정보 업데이트
            chatStore.chatList[index] = {
              ...chatStore.chatList[index],
              lastMsg: parsedMessage.msg,
              updateLastMsgTime: new Date(parsedMessage.updateLastMsgTime ?? Date.now()),
              unreadCount: parsedMessage.unreadCount,
            }
          } else {
            // 새로운 채팅방 추가
            chatStore.chatList.push({
              roomId: parsedMessage.roomId,
              name: parsedMessage.chatName,
              lastMsg: parsedMessage.msg,
              updateLastMsgTime: new Date(parsedMessage.updateLastMsgTime ?? Date.now()),
              unreadCount: parsedMessage.unreadCount,
            })
          }
          // 시간 기준으로 정렬
          chatStore.chatList.sort(
            (a, b) => b.updateLastMsgTime!.getTime() - a.updateLastMsgTime!.getTime(),
          )
        } catch (err) {
          console.error('메시지 파싱 실패:', err)
        }
      })
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame)
    },
  })
  websocketClient.activate()
}

async function getUserInfo() {
  if (myId.value === null) return
  try {
    const data = await fetchUserInfo(myId.value) // 임시 myId 넣기
    if (data) {
      localStorage.setItem('userName', data.name)
      myName.value = localStorage.getItem('userName')
    }
  } catch (err) {
    console.error(err)
  }
}
function handleButtonClick() {
  if (myId.value !== null) {
    getChatList() // Call API with user ID on button click
  } else {
    console.error('사용자 아이디를 입력해 주세요.')
  }
}

onMounted(() => {
  const storedId = localStorage.getItem('userId')
  if (storedId) {
    myId.value = Number(storedId)
    getChatList()
  }
  if (chatStore.chatList.length > 0) {
    console.log('전역 상태에서 채팅 목록 불러옴:', chatStore.chatList)
  }
  watch(myId, (newId) => {
    if (newId !== null) {
      localStorage.setItem('userId', String(newId))
    } else {
      localStorage.removeItem('userId')
    }
  })
})

onUnmounted(() => {
  if (websocketClient) {
    websocketClient.deactivate()
    console.log('웹소켓 연결 해제')
  }
})

function handleChatClick(chat: { roomId: number; name: string }) {
  console.log('chat 페이지 넘어가기 전에 확인:!!!!! : ', chat.name)
  router.push({
    path: '/chat',
    query: {
      id: Number(chat.roomId),
      name: chat.name,
      from: 'chatlist',
    },
  })
}

async function handleDeleteClick(roomId: number, event: { stopPropagation: () => void }) {
  event.stopPropagation()
  try {
    // TODO : 삭제할 때 카산드라 db에 있는 채팅 내용은 삭제가 안됨..
    await fetchChatDelete(roomId, myId.value!)
    console.log('삭제 완료!!')
    getChatList()
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <main>
    <div class="main">
      <h3>나의 채팅 목록</h3>
      <h5>테스트 사용자 아이디 지정</h5>
      <div>
        <input v-model.number="myId" placeholder="아이디 입력" @keyup.enter="handleButtonClick" />
        <button @click="handleButtonClick" style="margin-left: 10px">확인</button>
      </div>
      <div v-if="chatStore.chatList.length > 0">
        <div
          class="chat"
          v-for="chat in chatStore.chatList"
          :key="chat.roomId"
          @click="handleChatClick(chat)"
          style="cursor: pointer"
        >
          <div style="display: flex">
            <h3 style="margin-right: 20px; margin-left: 20px">[ {{ chat.name }} ] 채팅방</h3>
            <div class="unreadBox" v-if="chat.unreadCount && chat.unreadCount > 0">
              {{ chat.unreadCount }}
            </div>
          </div>

          <p>{{ chat.lastMsg || '메시지가 없습니다' }}</p>
          <p style="font-size: 8px; margin-left: 70%">
            {{ chat.updateLastMsgTime ? formatDate(chat.updateLastMsgTime.toString()) : '' }}
          </p>
          <button class="deleteBT" @click="handleDeleteClick(chat.roomId, $event)">나가기</button>
        </div>
      </div>
      <p v-else>채팅 목록이 없습니다.</p>
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
.chat {
  background: rgb(232, 255, 228);
  width: 300px;
  height: 120px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.deleteBT {
  margin: 5px;
  font-size: 13px;
  width: 70px;
  height: 30px;
  background: #8ec78bff;
  border: none;
  border-radius: 10px;
}
.unreadBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: red;
  color: white;
  border-radius: 45%;
  font-size: 12px;
}
</style>
