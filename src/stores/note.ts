import { defineStore } from 'pinia'

export interface Note {
  noteId: number
  aptId: number
  aptName: string
  phoneNumber: string
  noteText: string
  regDate: Date
  isRead: boolean
}

export const useNoteListStore = defineStore('notelist', {
  state: () => ({
    noteList: [] as Note[],
  }),
  actions: {
    setNoteList(newNoteList: Note[]) {
      this.noteList = newNoteList.map((note) => ({
        ...note,
      }))
    },
  },
})
