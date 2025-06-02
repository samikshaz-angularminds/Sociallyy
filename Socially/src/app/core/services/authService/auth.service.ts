import { inject, Injectable } from '@angular/core';
import { ApiService } from '../apiServices/api.service';
import { apiConstant } from '../../constants/apiConstants';
import { UserService } from '../userService/user.service';
import { tokenConstant } from '../../constants/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiService = inject(ApiService);
  userService = inject(UserService);


  constructor() { }

  getUser() {
    // this.userService.user$.subscribe((res: any) => {
    //   console.log(res)
    // })
  }

  getLoggedInUser(userid: string) {
    
  }

  refreshAccessToken() {
    this.getUser()
    const refreshToken = localStorage.getItem(tokenConstant.REFRESH_TOKEN) || '[]'
    
    console.log("refresh token from localstorage is-- ",refreshToken);
    
    return this.apiService.post(apiConstant.API_HOST_URL + apiConstant.REFRESH_ACCESS_TOKEN, {refreshToken})
  }

  logout() { }
}
