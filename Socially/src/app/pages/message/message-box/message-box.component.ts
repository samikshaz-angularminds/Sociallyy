import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import 'emoji-picker-element';
import { EmojiClickEvent } from 'emoji-picker-element/shared';
import { apiConstant } from '../../../core/constants/apiConstants';
import { MessageThread, IMessage } from '../../../core/models/message';
import { IUser } from '../../../core/models/user';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { UserService } from '../../../core/services/userService/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { bottom } from '@popperjs/core';
import { of } from 'rxjs';
import { ChatService } from '../../../core/services/chatService/chat.service';


@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MessageBoxComponent implements OnInit {
  @ViewChild('emojiPicker') emojiPicker !: ElementRef
  @ViewChildren('uname') unameElements !: QueryList<any>
  @Input() receiverUser !: IUser

  chatService = inject(ChatService)
  apiService = inject(ApiService)
  userService = inject(UserService)
  route = inject(ActivatedRoute)
  loggedInUser !: IUser
  receiver = ''
  msg = ''
  msgType = ''
  myMessages !: MessageThread[]
  otherUser !: IUser
  usersExceptme !: string[]
  hideEmoji = true
  conversationMessages: any[] = []
  userImage: { [key: string]: string } = {}
  newMsg !: string

  ngOnInit(): void {
    this.getUser()
    console.log('userid here?? ', this.receiverUser.id);
    this.getConversation(this.receiverUser.id)
    this.chatService.createSocketConnection()
  }

  getUser() {
    this.userService.user$.subscribe((res: any) => {
      this.loggedInUser = res
      console.log('LOGGEDIN User: ', this.loggedInUser);
    })
  }

  getConversation(other: string) {
    console.log('other: ', other);

    console.log(apiConstant.API_HOST_URL + apiConstant.SHOW_CONVERSATION + this.loggedInUser.username + `?otherUser=${other}`);

    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_CONVERSATION + this.loggedInUser?.id + `?otherUser=${other}`).subscribe({
      next: (res: any) => {
        console.log('CONVERSATION: ', res);
        this.conversationMessages = res[0]?.message
        this.chatService.seeNewMessage()

        this.conversationMessages?.reverse()

        console.log('COONVERSATION: ', this.conversationMessages);

      }
    })
  }

  getAnotherUser(uname: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_ANOTHER_USER + `?uid=${uname}&viewerId=${this.loggedInUser.id}`).subscribe({
      next: (res: any) => {
        console.log('AAAAAAAAAAA: ', res);
        console.log(res.profileImage.url);
        this.userImage[uname] = res.profileImage.url
      },
      error: (error) => console.log(error)
    })
  }



  getMessageType(event: Event) {
    const msgEvent = event.target as HTMLInputElement
    this.msgType = msgEvent.type
  }

  openEmojiPicker() {
    this.hideEmoji = !this.hideEmoji
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.emojiPicker && !this.emojiPicker.nativeElement.contains(event.target) && !(event.target as HTMLElement).closest('.w-10')) {
      this.hideEmoji = true
    }
  }

  selectedEmoji(event: EmojiClickEvent) {
    const emoji = event.detail.unicode
    this.msg = this.msg + emoji
  }

  onSend(receiverUserId: string) {
    const msgObj = { message: this.msg, messageType: this.msgType, receiver: receiverUserId }
    console.log('------------------------------------------------------------------------------------------------------------------------');
    

    console.log(msgObj);

    // this.chatService.sendMessage(this.msg);

    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.SEND_MESSAGE + this.loggedInUser.id, msgObj).subscribe({
      next: (res: any) => {
        console.log('MSG RESPONSE: ', res);
        this.chatService.emitMessage(this.msg)
        // this.conversationMessages.push(this.msg)
        this.msg = ''

        this.chatService.getMessages().subscribe((data: any) => {
          console.log('changes are:: ', data);
          this.getConversation(receiverUserId)
        })
      },
      error: (error) => console.log(error)

    })

  }

}

