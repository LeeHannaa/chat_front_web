import { defineStore } from 'pinia'

interface Chat {
  id: number
  writerId: number
  writerName: string
  createTime: string
  roomId: number
  name: string
  msg?: string
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
  }),
  actions: {
    setChats(newChats: Chat[]) {
      this.chats = newChats
    },
  },
})
