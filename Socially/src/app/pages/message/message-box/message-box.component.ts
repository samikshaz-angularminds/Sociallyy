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


@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MessageBoxComponent implements OnInit, OnChanges {
  @ViewChild('emojiPicker') emojiPicker !: ElementRef
  @ViewChildren('uname') unameElements !: QueryList<any>
  @Input() receiverUser !: IUser


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

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGE HAPPENEDDD');

    this.getUser()
    console.log(this.receiverUser.username);
    if (changes['receiverUser']) this.getConversation(this.receiverUser.username)
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

    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_CONVERSATION + this.loggedInUser?.username + `?otherUser=${other}`).subscribe({
      next: (res: any) => {
        console.log('CONVERSATION: ', res);

        this.conversationMessages = res[0]?.message
 

        this.conversationMessages.reverse()
        
        console.log('COOOOOOO: ', this.conversationMessages);



      }
    })
  }



  getValue() {
    console.log('hii');

    this.unameElements?.forEach((element) => this.getAnotherUser(element.nativeElement.innerText))

  }

  getAnotherUser(uname: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_ANOTHER_USER + `?username=${uname}&profile=${this.loggedInUser.username}`).subscribe({
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

  onSend(receiverUserName: string) {
    const msgObj = { message: this.msg, messageType: this.msgType, receiver: receiverUserName }

    console.log(msgObj);


    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.SEND_MESSAGE + this.loggedInUser.username, msgObj).subscribe({
      next: (res: any) => {
        console.log('MSG RESPONSE: ', res);
        this.msg = ''
        this.getConversation(receiverUserName)
      },
      error: (error) => console.log(error)

    })

  }

}
