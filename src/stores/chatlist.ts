import { defineStore } from 'pinia'

interface ChatRoom {
  id: number
  name: string
  lastMsg?: string
}

export const useChatListStore = defineStore('chatlist', {
  state: () => ({
    chatList: [] as ChatRoom[],
  }),
  actions: {
    setChatList(newChatList: ChatRoom[]) {
      this.chatList = newChatList
    },
  },
})
