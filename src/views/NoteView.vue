<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { deleteNoteRecord, fetchMyNoteList, readNote } from '../api/noteApi'
import { useNoteListStore, type Note } from '../stores/note'
import { formatDate } from '../plugins/formatDate'
import { connectWebSocket, disconnectWebSocket } from '../plugins/socketService'

const noteStore = useNoteListStore()
const myId = ref<number | null>(null)

async function getNoteList() {
  if (myId.value === null) return
  try {
    const data = await fetchMyNoteList(myId.value) // 임시 myId 넣기
    if (data) {
      noteStore.noteList = []
      noteStore.setNoteList(data)
      noteStore.sortNoteListByTime()
      console.log('채팅 목록:', data)
    }
    setupSocket()
  } catch (err) {
    console.error(err)
  }
}

function setupSocket() {
  if (myId.value) {
    connectWebSocket(myId.value, (parsedMessage) => {
      if (parsedMessage.type === 'NOTE') {
        const noteMessage = parsedMessage.message as Note
        // 새로운 쪽지 추가
        noteStore.addNote(noteMessage)
        noteStore.sortNoteListByTime()
      }
    })
  }
}

onMounted(() => {
  const storedId = localStorage.getItem('userId')
  if (storedId) {
    myId.value = Number(storedId)
    getNoteList()
  }
  if (noteStore.noteList.length > 0) {
    console.log('전역 상태에서 채팅 목록 불러옴:', noteStore.noteList)
  }
  watch(myId, (newId) => {
    if (newId !== null) {
      localStorage.setItem('userId', String(newId))
    } else {
      localStorage.removeItem('userId')
    }
  })
})

onUnmounted(() => {
  disconnectWebSocket()
})

const isModalOpen = ref(false)
const selectedNote = ref<Note | null>(null)

const openModal = (note: Note) => {
  selectedNote.value = note
  isModalOpen.value = true
  readNote(myId.value!, note.noteId)
  note.isRead = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedNote.value = null
}
const shortenText = (text: string | null | undefined) => {
  if (!text) return ''
  return text.length > 8 ? text.slice(0, 8) + '...' : text
}

async function deleteNote(noteId: number) {
  if (myId.value === null) return
  await deleteNoteRecord(noteId, myId.value)
  const index = noteStore.noteList.findIndex((note) => note.noteId === noteId)
  if (index !== -1) {
    noteStore.noteList.splice(index, 1)
  }
}
</script>

<template>
  <main>
    <div class="main">
      <h3>쪽지 문의 목록</h3>
      <div v-if="noteStore.noteList.length > 0">
        <div
          class="note"
          v-for="note in noteStore.noteList"
          :key="note.noteId"
          @click="openModal(note)"
          style="cursor: pointer"
        >
          <div style="display: flex">
            <h3 style="margin-right: 20px; margin-left: 20px">[ {{ note.aptName }} ] 문의</h3>
            <div
              v-if="!note.isRead"
              style="
                width: 8px;
                height: 8px;
                background-color: #ff2f2f;
                border-radius: 50%;
                margin-left: auto;
              "
            ></div>
          </div>
          <p>{{ shortenText(note.noteText) }}</p>
          <!-- <p style="font-size: 10px">
            {{ note.noteText ? '연락처 : ' + note.phoneNumber : '' }}
          </p> -->
          <p style="font-size: 8px; margin-left: 70%">
            {{ note.noteText ? formatDate(note.regDate.toString()) : '' }}
          </p>
          <button class="deleteBT" @click.stop="deleteNote(note.noteId)">🗑️ 삭제</button>
        </div>
      </div>
      <p v-else>문의 쪽지 목록이 없습니다.</p>
    </div>

    <!-- 모달 -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>쪽지 상세</h2>
        <p><strong>아파트:</strong> {{ selectedNote?.aptName }}</p>
        <p><strong>전화번호:</strong> {{ selectedNote?.phoneNumber }}</p>
        <p><strong>내용:</strong> {{ selectedNote?.noteText }}</p>
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </main>
</template>

<style>
.note {
  background: rgb(255, 253, 228);
  width: 300px;
  height: 120px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.unreadBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: red;
  color: white;
  border-radius: 45%;
  font-size: 12px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
.note-item {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
}
</style>
