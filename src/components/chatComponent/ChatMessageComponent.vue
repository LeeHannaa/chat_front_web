<script setup lang="ts">
import { type Chat } from '../../stores/chat'
// 채팅메시지 컴포넌트
interface Props {
  chat: Chat
  myId: number
  hiddenBtId: string[]
  formatDate: (date: string) => string
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'delete-message-to-all', id: string): void
  (e: 'click-invite-user', writerId: number, id: string): void
}>()
</script>
<template>
  <div v-if="chat.type === 'TEXT'" class="chat-content">
    <h3 v-if="chat.writerId !== myId">{{ chat.writerName }}</h3>
    <p class="msg-text">{{ chat.msg }}</p>
    <p class="date-text">{{ formatDate(chat.createdDate) }}</p>
    <div>
      <span class="isread">{{ chat.unreadCount === 0 ? '' : chat.unreadCount }}</span>
      <button
        class="deleteBT"
        v-if="chat.writerId === myId && !chat.delete"
        @click="emit('delete-message-to-all', chat.id)"
      >
        전체 🗑️
      </button>
    </div>
  </div>
  <div v-else-if="chat.type === 'SYSTEM'" class="chat-content">
    <template v-if="!chat.msg?.includes('초대')">
      <p>{{ chat.msg }}</p>
      <button
        v-if="!chat.delete && !hiddenBtId.includes(chat.id)"
        class="invite-button"
        @click="emit('click-invite-user', chat.writerId, chat.id)"
      >
        다시 초대하기
      </button>
    </template>
    <template v-else>
      <p>{{ chat.msg }}</p>
    </template>
  </div>
</template>

<style scoped>
.invite-button {
  font-size: 11px;
  color: #b68904;
  background: none;
  border: none;
  cursor: pointer;
}

.deleteBT {
  margin: 1px;
  font-size: 8px;
  height: 20px;
  max-width: 50px;
  background: #c2b65dff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.isread {
  font-size: 8px;
  color: gray;
}
.msg-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

.date-text {
  margin: 0;
  font-size: 8px;
  color: gray;
}
</style>
