import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, HostListener, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { UserService } from '../../../core/services/userService/user.service';
import { IUser } from '../../../core/models/user';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { apiConstant } from '../../../core/constants/apiConstants';
import { FormsModule } from '@angular/forms';
import { IMessage, MessageThread } from '../../../core/models/message';
import 'emoji-picker-element';
import { CommonModule } from '@angular/common';
import { EmojiClickEvent } from 'emoji-picker-element/shared';
import { FilteredUsersPipe } from '../../../core/pipes/usersListInMessages/filtered-users.pipe';
import { MessageBoxComponent } from "../message-box/message-box.component";

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, FilteredUsersPipe, MessageBoxComponent],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MessagingComponent implements OnInit, AfterViewInit {
  @ViewChild('emojiPicker') emojiPicker !: ElementRef
  @ViewChildren('uname') unameElements !: QueryList<any>


  apiService = inject(ApiService)
  userService = inject(UserService)
  route = inject(ActivatedRoute)
  loggedInUser !: IUser
  receiverUser !: IUser
  receiver = ''
  msg = ''
  msgType = ''
  myMessages !: MessageThread[]
  otherUser !: IUser
  usersExceptme !: string[]
  hideEmoji = true
  conversationMessages: IMessage[] = []
  userImage: { [key: string]: string } = {}
  conversations: any[] = []

  ngOnInit(): void {
    this.getUser()
    this.receiver = this.route.snapshot.queryParams['receiverName']
    // console.log('RECEIVER IN MESSAGING: ',this.receiver);
    if (this.receiver !== undefined) this.getReceiver(this.receiver)
  }

  ngAfterViewInit(): void {
    // console.log('afterviewinit');
    // console.log('QueryList:', this.unameElements);
    setTimeout(() => this.getValue(), 100);
  }

  getUser() {
    this.userService.user$.subscribe((res: any) => this.loggedInUser = res)
    this.getMyMessages(this.loggedInUser.username)
  }

  getMyMessages(myname: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_MY_MESSAGES + myname).subscribe({
      next: (res: any) => {
        console.log('MY MESSAGES ARE: ', res);
        this.myMessages = res
        this.getFormattedConversation()
      },
      error: (error) => console.log(error)
    })
  }

  async getFormattedConversation() {
    this.conversations = await Promise.all(
      this.myMessages.map(async (conversation) => {
        const otherUser = conversation.participants.find(user => user !== this.loggedInUser.username)
        console.log('OTHER USERS: ', otherUser);
  
        if (otherUser) {
          console.log('inside if block: ',otherUser);
          const user : any = await this.getAnotherUser(otherUser)
          console.log('USER IS: ',user);

          return {
            ...conversation,
            otherUser : {
              username : user.username,
              profilePic : user.profileImage.url
            }
          }

          
        }

        return {
          ...conversation,
          otherUser
        }
  
      })
    )

    console.log(this.conversations);
    
  }

  getValue() {
    // console.log('hii');
    this.unameElements?.forEach((element) => this.getAnotherUser(element.nativeElement.innerText))
  }

  getAnotherUser(uname: string) {
    return new Promise( (resolve,reject) => {
      this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_ANOTHER_USER + `?username=${uname}&profile=${this.loggedInUser.username}`).subscribe({
        next: (res: any) => {
          // console.log('AAAAAAAAAAA: ', res);
          // console.log(res.profileImage.url);
          this.userImage[uname] = res.profileImage.url
          resolve(res)
        },
        error: (error) => reject(error)
      })
    } )
  }

  getReceiver(receiver: string) {
    console.log(receiver);

    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_ANOTHER_USER + `?username=${receiver}&profile=${this.loggedInUser.username}`).subscribe({
      next: (res: any) => this.receiverUser = res,
      error: (error) => console.log(error)
    })
  }


  userChange(uname: HTMLElement) {
    this.getReceiver(uname.innerHTML.trim())
  }





}
