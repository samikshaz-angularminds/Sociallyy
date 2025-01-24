import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket !: Socket
  messageSubject = new Subject<any>()

  constructor() { }

  createSocketConnection() {
    this.socket = io('http://localhost:9000')
    console.log('CONNECTION CREATED');
    
  }

  emitMessage(message: string) {

    this.socket.emit('new-message', message)
    console.log('EMITTED MESSAGE IS-- ',message);
    
  }

  seeNewMessage() {
    this.socket.on('message', (data: any) => {
      console.log('DATA HERE:: ',data);
      this.messageSubject.next(data)
      
    })
  }

  getMessages(){
   return this.messageSubject.asObservable()
  }


}
