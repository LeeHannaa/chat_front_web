export const fetchChats = async function fetchData(myId: number, from: string, id: number) {
  let apiUrl = ''

  if (from === 'chatlist') {
    console.log('chatlist에서 옴!!!')
    apiUrl = `http://localhost:8080/chatmsg/find/list/${id}` // 채팅방 아이디
  } else {
    apiUrl = `http://localhost:8080/chatmsg/apt/find/list/${id}?myId=${myId}` // 매물 아이디
  }

  try {
    const response = await fetch(apiUrl.toString(), {
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
