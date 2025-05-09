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
    addNote(noteMessage: Note) {
      const recieveNote: Note = {
        noteId: noteMessage.noteId,
        aptId: noteMessage.aptId,
        aptName: noteMessage.aptName,
        phoneNumber: noteMessage.phoneNumber,
        noteText: noteMessage.noteText,
        regDate: new Date(noteMessage.regDate),
        isRead: noteMessage.isRead,
      }
      this.noteList.push(recieveNote)
    },
    sortNoteListByTime() {
      this.noteList.sort((a, b) => b.regDate!.getTime() - a.regDate!.getTime())
    },
  },
})
