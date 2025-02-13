import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { IUser } from '../../../core/models/user';
import { UserService } from '../../../core/services/userService/user.service';
import { DecodeTokenService } from '../../../core/services/decodeTokenService/decode-token.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css'
})
export class MyRequestsComponent implements OnInit {

  apiService = inject(ApiService)
  userService = inject(UserService)
  DecodeTokenService = inject(DecodeTokenService)
  user !: IUser
  requests !: IUser[]

  ngOnInit(): void {
    this.getUser()

  }

  getUser() {
    this.userService.user$.subscribe((res: any) => this.user = res)
    this.getRequests(this.user.id)
  }

  getRequests(uid: string) {
    console.log(this.user);
    
    console.log(apiConstant.API_HOST_URL + apiConstant.MY_REQUESTS + uid);
    
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.MY_REQUESTS + uid).subscribe({
      next: (res: any) => {
        this.requests = res
        console.log(res);

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  showOneUser(username: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_ANOTHER_USER + username).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error) => console.log(error)
    })
  }

  acceptRequest(requestorUid: string) {
    console.log('username: ', requestorUid);
    console.log('url: ', apiConstant.API_HOST_URL + apiConstant.ACCEPT_REQUEST + this.user.username);


    this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.ACCEPT_REQUEST + this.user.id, { requestorUid }).subscribe({
      next: (res: any) => {
        console.log('accepting requests: ', res);
        this.getRequests(requestorUid)
      },
      error: (error) => console.log(error)

    })
  }

  denyRequest(deletingUid: string) {
    console.log('deletor: ',this.user.username);
    console.log('being deleted: ',deletingUid);
    
    
    this.apiService.delete(apiConstant.API_HOST_URL + apiConstant.DELETE_REQUEST + this.user.id, '', { deletingUid }).subscribe({
      next: (res: any) => {
        if (res) console.log(res)
          this.getRequests(deletingUid)
      },
      error: (error) => console.log(error)

    })
  }

}
