import { defineStore } from 'pinia'

export interface Chat {
  id: string
  writerId: number
  writerName: string
  createdDate: string
  roomId: number
  count?: number
  msg?: string
  delete?: boolean
  isRead?: boolean
}
export interface postChat {
  writerName: string
  chatName: string
  writerId: number
  roomId: number
  msg?: string
  regDate: string
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
  }),
  actions: {
    setChats(newChats: Chat[]) {
      this.chats = newChats.map((chat) => ({
        ...chat,
        isRead: chat.isRead ?? true,
      }))
    },
  },
})
