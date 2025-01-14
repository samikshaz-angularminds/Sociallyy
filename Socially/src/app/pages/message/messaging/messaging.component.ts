import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { UserService } from '../../../core/services/userService/user.service';
import { IUser } from '../../../core/models/user';
import { ActivatedRoute } from '@angular/router';
import { apiConstant } from '../../../core/constants/apiConstants';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.css'
})
export class MessagingComponent implements OnInit{

  apiService = inject(ApiService)
  userService = inject(UserService)
  route = inject(ActivatedRoute)
  loggedInUser !: IUser
  receiverUser !: IUser
  receiver = ''


  ngOnInit(): void {
      this.getUser()
      this.receiver = this.route.snapshot.queryParams['receiverName']

     this.getReceiver(this.receiver)
      
  }

  getUser(){
    this.userService.user$.subscribe((res:any) => this.loggedInUser = res)
  }

  getReceiver(receiver:string){
    this.apiService.get(apiConstant.API_HOST_URL+apiConstant.SHOW_ANOTHER_USER+`?username=${receiver}&profile=${this.loggedInUser}`).subscribe({
      next : (res:any) => this.receiverUser = res,
      error : (error) => console.log(error)
    })
  }

}
