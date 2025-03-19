import { defineStore } from 'pinia'

export interface Chat {
  id: string
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
