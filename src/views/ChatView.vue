<script setup lang="ts">
import { onMounted } from 'vue'
import { fetchChats } from '../api/chatApi'
import { defineProps } from 'vue'
import { useChatStore } from '../stores/chat'

const props = defineProps<{
  myId: number
  id: number
  name: string
  from: string
}>()

const chatStore = useChatStore()

async function getChats() {
  try {
    const data = await fetchChats(props.myId, props.from, props.id)
    if (data) {
      chatStore.chats = []
      chatStore.setChats(data[0]?.body || [])
      console.log('채팅 내역:', chatStore.chats)
    }
  } catch (err) {
    console.error(err)
  }
}
onMounted(() => {
  getChats()
})
</script>

<template>
  <div class="chatpage">
    <h2>[ {{ props.name }} ] 대화방</h2>
    <div
      v-if="chatStore.chats.length > 0"
      style="width: 100%; display: flex; flex-direction: column"
    >
      <div
        v-for="chat in chatStore.chats"
        :key="chat.id"
        :class="{
          'my-chat': chat.writerId === props.myId,
          'other-chat': chat.writerId !== props.myId,
        }"
      >
        <div class="chat-content">
          <h3 v-if="chat.writerId === props.myId">
            {{ chat.writerName }}
          </h3>
          <p>{{ chat.msg }}</p>
        </div>
      </div>
    </div>
    <!-- TODO : 채팅입력창 만들고 api 연결 및 소켓 연결 후 테스팅 -->
  </div>
</template>

<style>
.chatpage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 15px;
}

.my-chat {
  align-self: flex-start;
  background-color: #d3f9d8;
  padding: 12px;
  border-radius: 10px;
  margin-right: 10px;
  max-width: 50%;
  margin-bottom: 12px;
}

.other-chat {
  align-self: flex-end;
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
</style>
