import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket !: Socket
  private serverUrl = 'http://localhost:9009'

  constructor() {
    this.socket = io(this.serverUrl)
  }

  sendMessage(msg: string) {
    this.socket.emit('new-message',msg)
  }

  getMessages() {
    const sub = new Subject<any>()
    this.socket.on('new-message', (data: any) => sub.next(data))
    return sub.asObservable()
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
