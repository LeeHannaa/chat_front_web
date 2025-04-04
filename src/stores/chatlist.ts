import { defineStore } from 'pinia'

export interface ChatRoom {
  id: number
  name: string
  lastMsg?: string
  updateLastMsgTime?: string
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
