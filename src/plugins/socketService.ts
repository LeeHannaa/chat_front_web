import type { ChatRoom } from '@/stores/chatlist'
import type { Note } from '@/stores/note'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'

interface WebSocketMessage {
  type: string
  message: ChatRoom | Note
}

let websocketClient: Client | null = null
let subscription: StompSubscription | null = null

export function connectWebSocket(
  myId: number,
  onMessage: (parsedMessage: WebSocketMessage) => void,
) {
  const url = 'ws://localhost:8080/ws-stomp'

  if (websocketClient?.active) {
    websocketClient.deactivate()
    console.log('기존 웹소켓 연결 해제')
  }

  websocketClient = new Client({
    brokerURL: url,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log('웹소켓 연결 성공')

      // 이전 구독이 있다면 해제
      if (subscription) {
        subscription.unsubscribe()
      }

      subscription = websocketClient!.subscribe(`/topic/user/${myId}`, (message: IMessage) => {
        try {
          const parsedMessage = JSON.parse(message.body)
          onMessage(parsedMessage)
          console.log(parsedMessage)
        } catch (error) {
          console.error('메시지 파싱 오류:', error)
        }
      })
    },
    onStompError: (frame) => {
      console.error('STOMP 에러:', frame)
    },
  })

  websocketClient.activate()
}

export function disconnectWebSocket() {
  if (websocketClient?.active) {
    subscription?.unsubscribe()
    websocketClient.deactivate()
    console.log('웹소켓 연결 종료')
  }
}
