import type { NoteNonMember } from '@/views/AptDetailView.vue'

export const postNoteByNonMember = async function fetchData(noteNonMember: NoteNonMember) {
  const apiUrl = `http://localhost:8080/note/send/nonmember`

  try {
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteNonMember),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response
  } catch (error) {
    console.error('API 요청 실패:', error)
    throw error // 에러를 상위 함수로 전달
  }
}

export const fetchMyNoteList = async (myId: number) => {
  try {
    const url = new URL(`http://localhost:8080/note/list?myId=${myId}`)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data // 응답 데이터를 반환
  } catch (error) {
    console.error('API 요청 실패:', error)
    throw error // 에러를 상위 함수로 전달
  }
}

export const readNote = async function fetchData(myId: number, noteId: number) {
  const apiUrl = `http://localhost:8080/note/read/note?myId=${myId}`

  try {
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: noteId.toString(),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response
  } catch (error) {
    console.error('API 요청 실패:', error)
    throw error // 에러를 상위 함수로 전달
  }
}

export const deleteNoteRecord = async (noteId: number, myId: number) => {
  try {
    const url = new URL(`http://localhost:8080/note/delete/${noteId}?myId=${myId}`)

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.error('API 요청 실패:', error)
    throw error // 에러를 상위 함수로 전달
  }
}
