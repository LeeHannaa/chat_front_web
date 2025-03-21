<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { fetchChats } from '../api/chatApi'
import { defineProps } from 'vue'
import { type Chat, type postChat, useChatStore } from '../stores/chat'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const props = defineProps<{
  id: number
  name: string
  from: string
}>()

import { Client } from '@stomp/stompjs'
let websocketClient: Client

const chatStore = useChatStore()
const myId = ref<number | null>(null)
const myName = ref<string | null>(null)
const roomId = ref<number | null>(null)
const msg = ref<string | null>(null)
const chatContainer = ref<HTMLElement | null>(null)

async function getChats() {
  if (myId.value === null) {
    console.error('사용자 ID가 없습니다.')
    return
  }
  try {
    const data = await fetchChats(myId.value, props.from, props.id)
    if (data) {
      chatStore.chats = []
      if (data[0]?.body && data[0].body[0]?.id !== null) {
        // 기존에 존재하던 대화방
        chatStore.setChats(data[0]?.body || [])
        roomId.value = data[0]?.body[0]?.roomId
        console.log('채팅방 아이디 : ', roomId.value, '\n 채팅 내역:', chatStore.chats)
      } else {
        // 방이 새로 만들어진 경우에는 setChats를 하지 않음
        roomId.value = data[0]?.body[0]?.roomId || null
        console.log('처음 방 생성!! 방 아이디 : ', roomId)
      }
      connect() // 웹소켓 연결
    }
  } catch (err) {
    console.error(err)
  }
}
onMounted(() => {
  myId.value = Number(localStorage.getItem('userId'))
  myName.value = localStorage.getItem('userName')
  console.log('myId : ', myId.value)
  if (isNaN(myId.value) || myId.value === null) {
    console.error('사용자 ID가 없습니다.')
    return
  }
  getChats()
})

function connect() {
  const url = 'ws://localhost:8080/ws-stomp'

  websocketClient = new Client({
    brokerURL: url,
    connectHeaders: {
      // 'Authorization': 'Bearer yourToken'
    },
    debug: (str) => {
      console.log(str)
    },
    onConnect: () => {
      console.log('웹소켓 연결 성공!')
      console.log('roomId.value : ', roomId.value)
      websocketClient.subscribe(`/topic/chatroom/${roomId.value ?? 0}`, (message) => {
        const parsedMessage = JSON.parse(message.body)
        const recieveChat: Chat = {
          id: parsedMessage.id,
          writerName: parsedMessage.writerName,
          writerId: parsedMessage.writerId,
          roomId: parsedMessage.roomId,
          msg: parsedMessage.msg,
          createdDate: parsedMessage.createdDate,
        }
        chatStore.chats.push(recieveChat)
        console.log('구독 메시지:', message.body)
      })
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame)
    },
  })
  websocketClient.activate()
}

function handleButtonClick() {
  // console.log('메시지 보내기 전 사용자 이름 확인 : ', myName.value)
  if (msg.value && msg.value.trim() !== '') {
    const newChat: postChat = {
      writerName: myName.value ?? '',
      writerId: myId.value ?? 0,
      roomId: roomId.value ?? 0,
      msg: msg.value.trim(),
    }
    // console.log('newChat 전송하는 정보 : ', newChat)
    websocketClient.publish({
      destination: '/app/message',
      body: JSON.stringify(newChat),
    })
    // 메시지 입력칸 초기화
    msg.value = null

    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  } else {
    console.log('빈 메시지는 전송할 수 없습니다.')
  }
}
// TODO : 날짜 포멧팅 과정 다시
function formatDate(dateTime: string): string {
  const date = new Date(dateTime)
  // const year = date.getFullYear()
  // const month = String(date.getMonth() + 1).padStart(2, '0') // 1월은 0부터 시작하므로 +1 해줍니다.
  // const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}
</script>

<template>
  <div class="chatpage">
    <h2>[ {{ props.name }} ] 대화방</h2>
    <div v-if="chatStore.chats.length > 0 && myId !== null" class="chatBox" ref="chatContainer">
      <div
        v-for="chat in chatStore.chats"
        :key="chat.id"
        :class="{
          'my-chat': chat.writerId === myId,
          'other-chat': chat.writerId !== myId,
        }"
      >
        <div class="chat-content">
          <h3 v-if="chat.writerId !== myId">
            {{ chat.writerName }}
          </h3>
          <p>{{ chat.msg }}</p>
          <p>{{ formatDate(chat.createdDate) }}</p>
        </div>
      </div>
    </div>
    <div class="inputBox">
      <input
        class="msginput"
        v-model="msg"
        placeholder="메시지를 입력하세요"
        @keyup.enter="handleButtonClick"
      />
      <button class="msgBT" @click="handleButtonClick" style="margin-left: 10px">확인</button>
    </div>
  </div>
</template>

<style>
.chatpage {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  position: relative;
  height: 70vh;
}

.chatBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 80%;
  overflow: auto;
}

.my-chat {
  align-self: flex-end;
  background-color: #d3f9d8;
  padding: 12px;
  border-radius: 10px;
  margin-right: 10px;
  max-width: 50%;
  margin-bottom: 12px;
}

.other-chat {
  align-self: flex-start;
  background-color: #e1f0f9;
  padding: 12px;
  border-radius: 10px;
  margin-left: 10px;
  max-width: 50%;
  margin-bottom: 12px;
}

.chat-content h3 {
  margin: 0;
  font-weight: bold;
}

.chat-content p {
  margin: 5px 0;
  font-size: 13px;
  line-height: 1.4;
}

.inputBox {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-left: 8%;
  margin-bottom: 20px;
  align-items: center;
}

.msginput {
  margin: 5px;
  font-size: 13px;
  width: 80%;
  height: 40px;
  border-radius: 10px;
  border: none;
  box-shadow: 4px 4px 6px rgba(139, 191, 102, 0.1);
  padding: 10px;
}

.msgBT {
  margin: 5px;
  font-size: 13px;
  width: 10%;
  height: 40px;
  background: #8ec78bff;
  border: none;
  border-radius: 10px;
}
</style>
