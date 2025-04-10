import { defineStore } from 'pinia'

export interface ChatRoom {
  id: number
  name: string
  lastMsg?: string
  updateLastMsgTime?: Date
  unreadCount?: number
}

export const useChatListStore = defineStore('chatlist', {
  state: () => ({
    chatList: [] as ChatRoom[],
  }),
  actions: {
    setChatList(newChatList: ChatRoom[]) {
      this.chatList = newChatList.map((chat) => ({
        ...chat,
        updateLastMsgTime: chat.updateLastMsgTime ? new Date(chat.updateLastMsgTime) : undefined,
      }))
    },
  },
})
